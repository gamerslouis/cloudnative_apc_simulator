import {OrderContext} from '../routers/v1/process'
type Myorder =
{
    period:String|number
    temperature:String|number
}
export interface Strategy{
    apply(order: OrderContext): Myorder;
}
export class defaultStrategy implements Strategy{
    public apply(order: OrderContext): Myorder
    {
        let myorder: Myorder = {
            period : (order.moisture * order.mFactor).toFixed(2),
            temperature: 100    
        } 
        return myorder				
    }
}
export class sharonStrategy implements Strategy{
    public apply(order: OrderContext): Myorder
    {
        let myorder: Myorder = {
            period : 20,
            temperature: (order.thickness * order.tFactor).toFixed(2)    
        } 
        return myorder				
    }
}
export class tboneStrategy implements Strategy{
    public apply(order: OrderContext): Myorder
    {
        let myorder: Myorder = {
            period : 25,
            temperature: (order.thickness * order.tFactor).toFixed(2)    
        } 
        return myorder				
    }
}
export class angusStrategy implements Strategy{
    public apply(order: OrderContext): Myorder
    {
        let myorder: Myorder = {
            period : (order.moisture * order.mFactor).toFixed(2),
            temperature: (order.thickness * order.tFactor).toFixed(2)    
        } 
        return myorder				
    }
}
