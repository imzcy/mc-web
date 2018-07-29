import uuidv1 from 'uuid/v1';

export default function reactListKey(arg0, ...args) {
    if (arg0 === null) {
        return uuidv1();
    }
    return [arg0, ...args].map(btoa).join('$');
}