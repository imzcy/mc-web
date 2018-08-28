import url from 'url';

export default async function fetchClient(path) {
    const raw = await (await fetch(url.resolve('http://api.mc.imzcy.com', path))).arrayBuffer();

    const base64 = window.btoa([].slice.call(new Uint8Array(raw)).map(v => String.fromCharCode(v)).join(''));

    return `data:image/png;base64,${base64}`;
}