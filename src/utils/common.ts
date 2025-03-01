export function genRandomString(length: number): string {
    let str = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        str += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return str;
}

export function getRandomDigit(length: number): string {
    const max = Math.pow(10, length);
    const randomNum = Math.floor(Math.random() * max);

    return randomNum.toString().padStart(length, '0');
}