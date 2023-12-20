const { sizeFormatter } = require('human-readable')
const os = require('os');

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
        { value: 1e3, symbol: 'K' },
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


