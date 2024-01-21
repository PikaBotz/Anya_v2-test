const { sizeFormatter } = require('human-readable')
const os = require('os');
const axios = require('axios');
const fs = require('fs');
let BodyForm = require('form-data')

exports.dayToday = () => {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const year = String(currentDate.getFullYear()).slice(-2);
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  return {
    date: formattedDate,
    time: formattedTime
  };
}

exports.getRandom = (length) => {
    let results = '';
    const characters = 'ABCDEFGHijklmnoPQRSTuvwxYZ1234567890';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        results += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return results;
}

exports.delay = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.getObjArray = (obj) => {
  const outputArray = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      outputArray.push({ key: key, url: obj[key] });
    }
  }
  return outputArray;
}

exports.formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const time = date.toLocaleTimeString('en-US', { hour12: false });
  const formattedTime = time.slice(0, 8);
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${String(date.getFullYear()).slice(2)}`;
  return {
    time: formattedTime,
    date: formattedDate
  };
}

exports.UploadFileUgu = async (input) => {
	return new Promise (async (resolve, reject) => {
			const form = new BodyForm();
			form.append("files[]", fs.createReadStream(input))
			await axios({
				url: "https://uguu.se/upload.php",
				method: "POST",
				headers: {
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
					...form.getHeaders()
				},
				data: form
			}).then((data) => {
				resolve(data.data.files[0])
			}).catch((err) => reject(err))
	})
}

exports.pickRandom = (list) => {
    return list[Math.floor(list.length * Math.random())];
 }
 
exports.isLatest = async () => {
  try {
    const response = await axios.get(`https://api.github.com/repos/PikaBotz/Anya_v2-MD/contents/package.json`);
    const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
    const packageJSON = JSON.parse(content);
    const version = packageJSON.version;
    const localPackage = require('../../package.json');
    const localVersion = localPackage.version;
    return version === localVersion;
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
};


exports.totalAnyaUsers = async () => {
 const data = await axios.get('https://pikaapi.vercel.app/api/visits.js?key=pikakun&dbname=anyaV2');
 return data.data.results.visitors;
}

exports.getMemoryInfo = () => {
  const totalMemory = Math.round(os.totalmem() / (1024 * 1024)); // Convert bytes to MB
  const freeMemory = Math.round(os.freemem() / (1024 * 1024)); // Convert bytes to MB
  const usedMemory = totalMemory - freeMemory;
  return {
    totalMemory: (totalMemory > 1024) ? `${(totalMemory/1024).toFixed(2)} GB` : `${totalMemory} MB`,
    usedMemory: (usedMemory > 1024) ? `${(usedMemory/1024).toFixed(2)} GB` : `${usedMemory} MB`
  };
}


exports.formatNumber = (num) => {
    if (num < 1000) {
        return num;
    }    
    const si = [
        { value: 1, symbol: '' },
        { value: 1e3, symbol: 'k' },
        { value: 1e6, symbol: 'M' },
        { value: 1e9, symbol: 'B' },
        { value: 1e12, symbol: 'T' },
        { value: 1e15, symbol: 'P' },
        { value: 1e18, symbol: 'E' }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const i = si.findIndex(({ value }) => num < value);
    const { value, symbol } = si[i - 1];    
    return (num / value).toFixed(2).replace(rx, '$1') + symbol;
}



exports.formatRuntime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = seconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const remainingSecs = Math.floor(remainingSeconds % 60);

  const formattedHours = hours > 0 ? `${hours}hr` : '';
  const formattedMinutes = minutes > 0 ? `${minutes}m` : '';
  const formattedSeconds = remainingSecs > 0 ? `${remainingSecs} sec` : '';

  const formattedRuntime = [formattedHours, formattedMinutes, formattedSeconds]
    .filter(Boolean) // Remove empty strings
    .join(', '); // Join the non-empty components with a comma and space

  return formattedRuntime;
}

exports.TelegraPh = async (Path) => {
	return new Promise (async (resolve, reject) => {
		if (!fs.existsSync(Path)) return reject(new Error("File not Found"))
		try {
			const form = new BodyForm();
			form.append("file", fs.createReadStream(Path))
			const data = await  axios({
				url: "https://telegra.ph/upload",
				method: "POST",
				headers: {
					...form.getHeaders()
				},
				data: form
			})
			return resolve("https://telegra.ph" + data.data[0].src)
		} catch (err) {
			return reject(new Error(String(err)))
		}
	})
}

exports.getBuffer = async (url, options) => {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (err) {
		return err
	}
}


exports.getStream = async (url, folderPath) => {
    try {
        const response = await axios({
            url: url,
            method: 'GET',
            responseType: 'stream'
        });
        const fileName = path.basename(url);
        const filePath = path.join(folderPath, fileName);
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
        return filePath;
    } catch (error) {
        throw new Error(`Error downloading file: ${error}`);
    }
}

exports.sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}

exports.formatp = sizeFormatter({
    std: 'JEDEC', //'SI' = default | 'IEC' | 'JEDEC'
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`,
})

exports.jsonformat = (string) => {
    return JSON.stringify(string, null, 2)
}

exports.post = async (url, formdata = {}, cookies) => {
  let encode = encodeURIComponent;
  let body = Object.keys(formdata)
    .map((key) => {
      let vals = formdata[key];
      let isArray = Array.isArray(vals);
      let keys = encode(key + (isArray ? "[]" : ""));
      if (!isArray) vals = [vals];
      let out = [];
      for (let valq of vals) out.push(keys + "=" + encode(valq));
      return out.join("&");
    })
    .join("&");
  return await fetch(`${url}?${body}`, {
    method: "GET",
    headers: {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      Cookie: cookies,
    },
  });
}
