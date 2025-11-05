import { useContext} from "react";
import MainSummaryComp from "./MainSummaryComp";
import CardNav from "./NavBar";
import { UserContext } from "../App";

export default function Home(){
    const {items} = useContext(UserContext);
    
    return(
        <div>
            <div className="h-[100vh] w-full bg-gray-900">
                <CardNav
                logo='./assets/ai_logo.png'
                logoAlt="Company Logo"
                items={items}
                baseColor="#fff"
                menuColor="#000"
                buttonBgColor="#111"
                buttonTextColor="#fff"
                ease="power3.out"
                />
                <MainSummaryComp/>
            </div>
            
        </div>
    )
}