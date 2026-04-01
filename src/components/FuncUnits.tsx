import {Flex,Grid,Text} from "@radix-ui/themes";
import { useSimulation } from "../hooks/useSimulation";
import { type FunctionUnit } from "../simulation/Simulation"; 

const FuncUnitGroup = ({title,units,addOrMultiply}:{title :string,units:Array<FunctionUnit>,addOrMultiply:String}) => {
    return (
    <Flex direction="column">
        <Text size="2" weight="bold">{title}</Text>
      <Grid columns="5" gap="2" className="items-center text-sm whitespace-nowrap">
            
            <Text size="1" weight="bold" color="gray">Op</Text>
            <Text size="1" weight="bold" color="gray">Arg1</Text>
            <Text size="1" weight="bold" color="gray">Arg2</Text>
            <Text size="1" weight="bold" color="gray" wrap="wrap">Cycles left</Text>
            <Text size="1" weight="bold" color="gray">Source</Text>
        {units.map((i)=>(
            <FuncUnitRows unit={i} addOrMull={addOrMultiply}/>
        ))}
    </Grid>
</Flex>
)
}
const FuncUnitRows = ({unit,addOrMull}:{unit:FunctionUnit,addOrMull:String}) =>{
    
   

    return(
    <>
        <Text className="border-b border-gray-100 py-1">{unit.operation ?? "-"}</Text>
        <Text className="border-b border-gray-100 py-1">{unit.firstArgumentValue ?? "-"}</Text>
        <Text className="border-b border-gray-100 py-1">{unit.secondArgumentValue ?? "-"}</Text>
        <Text className="border-b border-gray-100 py-1">{unit.ticksLeft ?? "-"}</Text>
       <Text className="border-b border-gray-100 py-1">
  {unit.sourceReservationStation != null
    ? `${addOrMull}${unit.sourceReservationStation}`
    : "-"}
</Text>
        
    </>
    )
}
export const FuncUnits = () => {
    const [MDF, ASF] = useSimulation((data) => [data.multiplyDivideFunctionUnits, data.addSubtractFunctionUnits])
    return (

        <Grid columns="2" gap="2">
            <FuncUnitGroup title="Add/Subtract" units={ASF}   addOrMultiply="add"/>
            <FuncUnitGroup title="Mul/Dev" units={MDF} addOrMultiply="mul"/>
        </Grid>
    )
}
