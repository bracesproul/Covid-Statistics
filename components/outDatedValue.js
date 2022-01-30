import { useState } from 'react';

export const OutDatedValue = ({nameOfData, data, dataDate, currentDate}) => {
    const [hover, setHover] = useState(false);

    const onHover = (e) => {
        e.preventDefault();
        setHover(true);
        console.log('HOVER - ', hover);
    }
    const onLeave = (e) => {
        e.preventDefault();
        setHover(false)
        console.log('HOVER - ', hover);
    }

    return (
        <>
        <span onMouseEnter={e => onHover(e)} onMouseLeave={e => onLeave(e)} className="tooltip">
            { hover ? <ShowOnHover dataDate={dataDate} currentDate={currentDate} /> : null }
            <p className="sameLine">{nameOfData}: <strong className="cases">{data}*</strong></p>
        </span>
        </>
    )
}

const ShowOnHover = ({dataDate, currentDate}) => {
    return (
        <span className="tooltiptext" >
            <p>Data not avaiable for {currentDate}</p>
            <p>Showing closest avaiable data ( {dataDate} )</p>
        </span>
    )
}