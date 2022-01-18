export const getArrayOfDates = (startDate, endDate) => {
    const listDate = [];
    // const startDate ='2017-02-01';
    // const endDate = '2017-02-10';
    const dateMove = new Date(startDate);
    let strDate = startDate;
    
    while (strDate < endDate) {
      strDate = dateMove.toISOString().slice(0, 10);
      listDate.push(strDate);
      dateMove.setDate(dateMove.getDate() + 1);
    };
    return listDate
}