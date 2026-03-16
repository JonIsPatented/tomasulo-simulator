import "./storeBuffer.css"
interface StoreBufferProps{
    StoreBufferAddress:string,
    StoreBufferValue:string
}
export const StoreBuffer = ({StoreBufferAddress,StoreBufferValue}:StoreBufferProps)=>{
    return(
        <div>
        <div>{StoreBufferAddress}</div>
        <div>{StoreBufferValue}</div>
        </div>
    )
}
