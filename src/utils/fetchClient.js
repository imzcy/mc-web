export default async function fetchClient(path) {
    return await (await fetch('http://api.mc.imzcy.com' + path)).json();
}