const axios = require('axios')
const cheerio = require('cheerio')

function pinterest(query){
return new Promise(async(resolve,reject) => {
axios.get('https://id.pinterest.com/search/pins/?autologin=true&q=' + query, {
headers: {
"cookie" : "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0"
}
}).then(({ data }) => {
const $ = cheerio.load(data)
const result = [];
const hasil = [];
 $('div > a').get().map(b => {
const link = $(b).find('img').attr('src')
result.push(link)
});
result.forEach(v => {
if(v == undefined) return
hasil.push(v.replace(/236/g,'736'))
})
hasil.shift();
resolve(hasil)
})
})
}

function wallpaper(title, page = '1') {
return new Promise((resolve, reject) => {
axios.get(`https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${title}`)
.then(({ data }) => {
let $ = cheerio.load(data)
let hasil = []
$('div.grid-item').each(function (a, b) {
hasil.push({
title: $(b).find('div.info > a > h3').text(),
type: $(b).find('div.info > a:nth-child(2)').text(),
source: 'https://www.besthdwallpaper.com/'+$(b).find('div > a:nth-child(3)').attr('href'),
image: [$(b).find('picture > img').attr('data-src') || $(b).find('picture > img').attr('src'), $(b).find('picture > source:nth-child(1)').attr('srcset'), $(b).find('picture > source:nth-child(2)').attr('srcset')]
})
})
resolve(hasil)
})
})
}

function wikimedia(title) {
return new Promise((resolve, reject) => {
axios.get(`https://commons.wikimedia.org/w/index.php?search=${title}&title=Special:MediaSearch&go=Go&type=image`)
.then((res) => {
let $ = cheerio.load(res.data)
let hasil = []
$('.sdms-search-results__list-wrapper > div > a').each(function (a, b) {
hasil.push({
title: $(b).find('img').attr('alt'),
source: $(b).attr('href'),
image: $(b).find('img').attr('data-src') || $(b).find('img').attr('src')
})
})
resolve(hasil)
})
})
}

function quotesAnime() {
return new Promise((resolve, reject) => {
const page = Math.floor(Math.random() * 184)
axios.get('https://otakotaku.com/quote/feed/'+page)
.then(({ data }) => {
const $ = cheerio.load(data)
const hasil = []
$('div.kotodama-list').each(function(l, h) {
hasil.push({
link: $(h).find('a').attr('href'),
gambar: $(h).find('img').attr('data-src'),
karakter: $(h).find('div.char-name').text().trim(),
anime: $(h).find('div.anime-title').text().trim(),
episode: $(h).find('div.meta').text(),
up_at: $(h).find('small.meta').text(),
quotes: $(h).find('div.quote').text().trim()
})
})
resolve(hasil)
}).catch(reject)
})
}

function happymod(query) {
return new Promise((resolve, reject) => {
const baseUrl = 'https://www.happymod.com/'
axios.get(baseUrl+'search.html?q='+query).then(async res => {
var $ = cheerio.load(res.data)
const hasil = []
$("div.pdt-app-box").each(function(c, d) {
var title = $(d).find("a").text().trim();
var icon = $(d).find("img.lazy").attr('data-original');
var rating = $(d).find("span").text();
var link = baseUrl+$(d).find("a").attr('href');
hasil.push({
title,
icon,
link,
rating
})
})
resolve(hasil)
console.log(hasil)
}).catch(reject)
})
}

function umma(url) {
return new Promise((resolve, reject) => {
axios.get(url)
.then((res) => {
let $ = cheerio.load(res.data)
let image = []
$('#article-content > div').find('img').each(function (a, b) {
image.push($(b).attr('src')) 
})
let hasil = {
title: $('#wrap > div.content-container.font-6-16 > h1').text().trim(),
author: {
name: $('#wrap > div.content-container.font-6-16 > div.content-top > div > div.user-ame.font-6-16.fw').text().trim(),
profilePic: $('#wrap > div.content-container.font-6-16 > div.content-top > div > div.profile-photo > img.photo').attr('src')
},
caption: $('#article-content > div > p').text().trim(),
media: $('#article-content > div > iframe').attr('src') ? [$('#article-content > div > iframe').attr('src')] : image,
type: $('#article-content > div > iframe').attr('src') ? 'video' : 'image',
like: $('#wrap > div.bottom-btns > div > button:nth-child(1) > div.text.font-6-12').text(),
}
resolve(hasil)
})
})
}

function ringtone(title) {
return new Promise((resolve, reject) => {
axios.get('https://meloboom.com/en/search/'+title)
.then((get) => {
let $ = cheerio.load(get.data)
let hasil = []
$('#__next > main > section > div.jsx-2244708474.container > div > div > div > div:nth-child(4) > div > div > div > ul > li').each(function (a, b) {
hasil.push({ title: $(b).find('h4').text(), source: 'https://meloboom.com/'+$(b).find('a').attr('href'), audio: $(b).find('audio').attr('src') })
})
resolve(hasil)
})
})
}

async function jadwalsholat(query){
return new Promise((resolve, reject) => {
axios.get(`https://umrotix.com/jadwal-sholat/${query}`)
.then(({
data
}) => {
const $ = cheerio.load(data)
$('body > div > div.main-wrapper.scrollspy-action > div:nth-child(3) ').each(function(a, b) { 
result = { 
tanggal: $(b).find('> div:nth-child(2)').text(),
imsyak: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(1) > p:nth-child(2)').text(),
subuh: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(2) > p:nth-child(2)').text(),
dzuhur: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(3) > p:nth-child(2)').text(),
ashar: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(4) > p:nth-child(2)').text(),
maghrib: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(5) > p:nth-child(2)').text(),
isya: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(6) > p:nth-child(2)').text()
}
resolve(result)
})
})
.catch(reject)
})
}

function styletext(teks) {
return new Promise((resolve, reject) => {
axios.get('http://qaz.wtf/u/convert.cgi?text='+teks)
.then(({ data }) => {
let $ = cheerio.load(data)
let hasil = []
$('table > tbody > tr').each(function (a, b) {
hasil.push({ name: $(b).find('td:nth-child(1) > span').text(), result: $(b).find('td:nth-child(2)').text().trim() })
})
resolve(hasil)
})
})
}

function EmiDiffunction(text) {
    try {
        const response = await axios.post(
            'https://nexra.aryahcr.cc/api/image/complements',
            {
                prompt: text, 
                model: "emi"
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        let err = null;
        let result = null;
        
        if (typeof response.data === 'object') {
            if (response.data.code === 200 && response.data.status === true) {
                result = response.data;
            } else {
                err = response.data;
            }
        } else {
            let jsonStartIndex = response.data.indexOf('{');
            if (jsonStartIndex === -1) {
                err = {
                    code: 500,
                    status: false,
                    error: "INTERNAL_SERVER_ERROR",
                    message: "general (unknown) error"
                };
            } else {
                try {
                    let parsedData = JSON.parse(response.data.slice(jsonStartIndex));
                    if (parsedData.code === 200 && parsedData.status === true) {
                        result = parsedData;
                    } else {
                        err = parsedData;
                    }
                } catch (e) {
                    err = {
                        code: 500,
                        status: false,
                        error: "INTERNAL_SERVER_ERROR",
                        message: "general (unknown) error"
                    };
                }
            }
        }

        if (result === null && err !== null) {
            console.log(err);
            return err;
        } else {
            console.log(result);
            return result;
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            code: 500,
            status: false,
            error: "REQUEST_FAILED",
            message: error.message
        };
    }


module.exports = { pinterest, wallpaper, wikimedia, quotesAnime, happymod, umma, ringtone, jadwalsholat, styletext,EmiDiffunction }
