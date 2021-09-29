import moment from 'moment-mini';

// let prs = []
// function mockData(n) {
//     var c = moment().valueOf()
//     const cities = ["Berlin", "Zurich", "London", "San Francisco", "New York"];
//     for (var i = 0; i < n; i++) {
//         c -= 86400000/10 + Math.random() * 86400000*2
//         const randomCity = cities[Math.floor(Math.random() * cities.length)];
//         let p = {...prompts[Math.floor(Math.random() * prompts.length)]};
//         p.c = randomCity
//         p.d = Math.floor(c);
//         p.fo = moment(p.d).format()
//         prs.push(p)
//     }
// }

// mockData(300)
// console.log(prs)

window.moment = moment;


function pickFor(timeframe, prompts) {
    // console.log(timeframe)
    let picks = []
    let valForPrompt;
    const so = timeframe.so
    const eo = timeframe.eo
    const mo = so+(eo-so)/2;
    // filter prompts to this timeframe
    let ps = prompts.filter((p) => {
        // console.log(p.d.valueOf())
        // console.log(p.d.valueOf() > so && p.d.valueOf() < eo)
        return p.d.valueOf() > so && p.d.valueOf() < eo;
    })
    // console.log(ps)
    // precalculate distances to start middle end of timeframe
    ps.forEach((p) => {
        p.so = Math.abs(moment(p.d).startOf('day').valueOf() - so) / 86400000
        p.eo = Math.abs(moment(p.d).startOf('day').valueOf() - eo) / 86400000
        p.mo = Math.abs(moment(p.d).startOf('day').valueOf() - mo) / 86400000
        p.cu = 0
        p.pu = 0
        p.u = 0
    })
    // console.log(ps)
    let pick = () => {
        if (ps[0] && !ps[0].u) {
            ps[0].u++;
            picks.push(ps[0])
            ps.forEach((p) => {
                if (p.t.toLowerCase() == ps[0].t.toLowerCase()) {
                    p.pu++;
                }
                if (p.c && ps[0].c && p.c.toLowerCase() == ps[0].c.toLowerCase()) {
                    p.cu++;
                }
            })
        }
    }
    valForPrompt = (p) => p.eo+p.cu+p.pu+p.u;
    function sortFn(pa, pb) {
        const a = valForPrompt(pa)
        const b = valForPrompt(pb)
        return a == b ? 0 : a > b ? 1 : -1;
    }
    ps.sort(sortFn)
    pick()
    valForPrompt = (p) => p.mo+p.cu+p.pu+p.u;
    ps.sort(sortFn)
    pick()
    valForPrompt = (p) => p.so+p.cu+p.pu+p.u;
    ps.sort(sortFn)
    pick()
    // console.log(picks)
    return picks;
}



const uc = (word) => (word.charAt(0).toUpperCase() + word.slice(1));
const actor = (p) => `someone`
const timeA = (p) => `${moment(p.d).fromNow()}`
const tod = (p) => {
    const h = moment(p.d).hour()
    if (h < 5) return 'middle of the night';
    if (h < 9) return 'early hours';
    if (h < 12) return 'morning';
    else if (h < 15) return 'early afternoon';
    else if (h < 18) return 'afternoon';
    else if (h < 24) return 'evening';
}

const templateA = (p,t) => p ? uc(`${t instanceof Function ? t(p) : t} in ${p.c}, ${actor(p)} ${p.p}.`) : null
const templateB = (p,t) => p ? uc(`${t instanceof Function ? t(p) : t}, ${actor(p)} ${p.p} in ${p.c}.`) : null
const templateC = (p,t) => p ? uc(`${actor(p)} ${p.p} in ${p.c} ${t instanceof Function ? t(p) : t}.`) : null
const templateD = (p,t) => p ? uc(`In ${p.c}, ${actor(p)} ${p.p} ${t instanceof Function ? t(p) : t}.`) : null
const templateE = (p,t) => p ? uc(`${t instanceof Function ? t(p) : t}, ${actor(p)} in ${p.c} ${p.p}.`) : null

const blockJustNow = (prs) => [
    templateC(prs[0], (p) => `just now`), 
    templateD(prs[1], (p) => `${moment(p.d).fromNow()}`), 
    templateA(prs[2], (p) => `before`)
]

const blockToday = (prs) => [
    templateA(prs[0], (p) => `this ${tod(p.d)}`), 
    templateB(prs[1], (p) => `earlier than that`), 
    templateE(prs[2], (p) => `while`)
]
const blockThisWeek = (prs) => [
    templateC(prs[0], (p) => `this past ${moment(p.d).format('dddd')}`), 
    templateB(prs[1], (p) => `on ${moment(p.d).format('dddd')} in the ${tod(p.d)}`), 
    templateD(prs[2], (p) => `on ${moment(p.d).format('dddd')}`)
]
const blockLastWeek = (prs) => [
    templateE(prs[0], (p) => `${moment(p.d).format('dddd')} last week`), 
    templateA(prs[1], (p) => `earlier on ${moment(p.d).format('dddd')}`), 
    templateB(prs[2], (p) => `on ${moment(p.d).format('dddd')} in the ${tod(p.d)}`)
]
const blockThisYear = (prs) => [
    templateC(prs[0], (p) => `on a ${moment(p.d).format('dddd')} in ${moment(p.d).format('MMMM')}`), 
    templateA(prs[1], (p) => `on ${moment(p.d).format('MMMM Qo')}`), 
    templateD(prs[2], (p) => `in the ${tod(p.d)} on a day in ${moment(p.d).format('MMMM')}`)
]

const blockBefore = (prs) => {
    const n = prs.length;
    var cities = prs.map((p) => p.c)
    cities = [...new Set(cities)]
    if (n && cities.length) return `Before that, ${n} people took purposeless walks across ${cities.length} cities.`; else return '';
}

const personalStory = (prs) => {
    // on date in location, you first, second, last
    let blocks = []
    if (prs && prs.length) {
        let first = prs[0]
        blocks.push(`On ${moment(first.d).format('MMMM Qo')}`)
        if (first.c) blocks.push(`in ${first.c}`)
        blocks.push(`you`)
        prs.map((p,i) => {
            blocks.push(p.p + (
                i < prs.length-2 
                    ? ','
                    : i == prs.length-1
                        ? '.'
                        : '')) 
            if (i == prs.length-2) blocks.push('and')
        })
        return blocks.join(' ')
    }
}

const story = (prs) => {
    const justNow = {
        eo: moment().valueOf(),
        so: moment().subtract(10,'minutes').valueOf(),
    }
    const today = {
        eo: moment().subtract(10,'minutes').valueOf(),
        so: moment().startOf('day').valueOf(),
    }
    const thisWeek = {
        eo: moment().startOf('day').valueOf(),
        so: moment().subtract(7,'days').endOf('isoWeek').valueOf(),
    }
    const lastWeek = {
        eo: moment().subtract(7,'days').endOf('isoWeek').valueOf(),
        so: moment().subtract(7,'days').startOf('isoWeek').valueOf(),
    }
    const thisYear = {
        eo: moment().subtract(7,'days').startOf('isoWeek').valueOf(),
        so: moment().startOf('year').valueOf(),
    }

    // console.log(prs)
    let s = ''
    let block;
    block = blockJustNow(pickFor(justNow,prs)).filter(Boolean).join(' ')
    s += block;
    if (block.length) s += '\n\n';
    block = blockToday(pickFor(today,prs)).filter(Boolean).join(' ')
    s += block;
    if (block.length) s += '\n\n';
    block = blockThisWeek(pickFor(thisWeek,prs)).filter(Boolean).join(' ')
    s += block;
    if (block.length) s += '\n\n';
    block = blockLastWeek(pickFor(lastWeek,prs)).filter(Boolean).join(' ')
    s += block;
    if (block.length) s += '\n\n';
    block = blockThisYear(pickFor(thisYear,prs)).filter(Boolean).join(' ')
    s += block;
    if (block.length) s += '\n\n';

    let ps = prs.filter((p) => {
        return p.d.valueOf() < moment().startOf('year').valueOf()
    })
    block = blockBefore(ps)
    s += block;
    return s;
}

export { story, personalStory }