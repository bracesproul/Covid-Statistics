export const currentDate = () => {
    const newDate = new Date();
    const year = newDate.getFullYear();
    const month = newDate.toLocaleString('default', { month: 'long' });
    const day = () => {
        if (newDate.getDate().toString() === "1" && month - 1 === (2 || 4 || 6 || 9 || 11)) {
            return 30; 
        } else if (newDate.getDate().toString() === "1" && month - 1 === (1 || 3 || 5 || 7 || 8 || 10 || 12)) {
            return 31;
        } else {
            return newDate.getDate() - 1
        }
    }
    const toBeReturned = `${month} ${day()}, ${year}`;
    return toBeReturned;
}