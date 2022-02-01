import { useState } from 'react';

export const OutDatedValue = ({nameOfData, data, dataDate, currentDate, uiClass}) => {
    const [hover, setHover] = useState(false);

    const onHover = (e) => {
        e.preventDefault();
        setHover(true);
    }
    const onLeave = (e) => {
        e.preventDefault();
        setHover(false)
    }

    return (
        <>
        <span onMouseEnter={e => onHover(e)} onMouseLeave={e => onLeave(e)} className="tooltip">
            { hover ? <ShowOnHover dataDate={dataDate} currentDate={currentDate} /> : null }
            <p className="sameLine">{nameOfData}: <strong className={uiClass}>{data}*</strong></p>
            <br />
        </span>
        <br />
        </>
    )
}

export const OutdatedChart = ({nameOfData, dataDate, currentDate }) => {
    const [hover, setHover] = useState(false);

    const onHover = (e) => {
        e.preventDefault();
        setHover(true);
    }
    const onLeave = (e) => {
        e.preventDefault();
        setHover(false)
    }

    return (
        <>
        <span onMouseEnter={e => onHover(e)} onMouseLeave={e => onLeave(e)} className="tooltip">
            { hover ? <ShowOnHover dataDate={dataDate} currentDate={currentDate} /> : null }

            <p className="sameLine">{nameOfData}*</p>

            <br />
        </span>
        <br />
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

