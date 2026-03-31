import {Flex,Grid,Text} from "@radix-ui/themes";
import { useSimulation } from "../hooks/useSimulation";
import { type FunctionUnit } from "../simulation/Simulation"; 
const FuncUnitGroup = ({title,units,addOrMultiply}:{title :string,units:Array<FunctionUnit>,addOrMultiply:String}) => {
    const index = 0
    return (
    <Flex direction="column">
        <Text size="2" weight="bold">{title}</Text>
      <Grid columns="6" gap="2" className="items-center text-sm whitespace-nowrap">
            <Text size="1" weight="bold" color="gray">name</Text>
            <Text size="1" weight="bold" color="gray">Op</Text>
            <Text size="1" weight="bold" color="gray">Arg1</Text>
            <Text size="1" weight="bold" color="gray">Arg2</Text>
            <Text size="1" weight="bold" color="gray">TL</Text>
            <Text size="1" weight="bold" color="gray">sourceReg</Text>
        {units.map((i)=>(
            <FuncUnitRows unit={i} addOrMull={addOrMultiply} Index={index}/>
        ))}
    </Grid>
</Flex>
)
}
const FuncUnitRows = ({unit,addOrMull,Index}:{unit:FunctionUnit,addOrMull:String,Index:Number}) =>{
    const name = addOrMull +Index.toString()
    return(
    <>
        <Text className="border-b border-gray-100 py-1">{name}</Text>
        <Text className="border-b border-gray-100 py-1">{unit.operation ?? "-"}</Text>
        <Text className="border-b border-gray-100 py-1">{unit.firstArgumentValue ?? "-"}</Text>
        <Text className="border-b border-gray-100 py-1">{unit.secondArgumentValue ?? "-"}</Text>
        <Text className="border-b border-gray-100 py-1">{unit.ticksLeft ?? "-"}</Text>
        <Text className="border-b border-gray-100 py-1">{unit.sourceReservationStation ?? "-"}</Text>
    </>
    
    )
}
export const FuncUnits = () => {
    const [MDF, ASF] = useSimulation((data) => [data.multiplyDivideFunctionUnits, data.addSubtractFunctionUnits])
    return (

        <Grid columns="2" gap="9">
            <FuncUnitGroup title="add or subtract" units={ASF}   addOrMultiply="add"/>
            <FuncUnitGroup title="multipy or devide" units={MDF} addOrMultiply="mul"/>
        </Grid>
    )
}
