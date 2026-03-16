interface ResStationProps{
    MultOrAdd:string,
    instruction:string,
    oprandOne:string,
    oprandTwo:string
}
export const ResStation = ({MultOrAdd,instruction,oprandOne,oprandTwo}:ResStationProps)=>{
    return(
        <div>
            <div>{instruction}</div>
            <div>{oprandOne}</div>
            <div>{oprandTwo}</div>
        </div>
    )
}