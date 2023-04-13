
import './loaderComp.css'
import SkewLoader from "react-spinners/ScaleLoader";

function LoaderComp({loading}){
    return(
        <div id="loadComp">
            <SkewLoader color={'#00f9df'}loading={loading} height={72} width={20} radius={20} margin={12} data-test id="loader1"/>
            <SkewLoader color={'#00f9df'}loading={loading} height={72} width={20} radius={20} margin={12} data-test id="loader2"/>
        </div>
    )
}
export default LoaderComp