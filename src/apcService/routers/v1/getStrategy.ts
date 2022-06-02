import {defaultStrategy} from '../../utilities/strategy';
import {Strategy} from '../../utilities/strategy';
import {sharonStrategy} from '../../utilities/strategy';
import {tboneStrategy} from '../../utilities/strategy';
import {angusStrategy} from '../../utilities/strategy';
export function getStrategy(type: String): Strategy
{
        if(type ==  'SHARON')
        {
            return new sharonStrategy();
        }
        else if(type ==  'TBONE')
        {
            return new tboneStrategy();
        }
        else if(type ==  'ANGUS')
        {
            return new angusStrategy();
        }
        else
        {
            return new defaultStrategy()
        }
        
} 
