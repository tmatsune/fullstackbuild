
import './homePage.css'
import BG from '../../images/bg1.jpeg'
import EX from '../../images/exp.png'
import MIC from '../../images/mic.png'
import NOTES from '../../images/notes.png'


function HomePage(){
    return(   
        <div id="homeMain">
            <div className="hpWrapper">
                <h3 className='hp3'>BILD</h3>
                <div id="twopoint">
                    <h3 id="h31">2</h3>
                    <h3 id="h32">.</h3>
                    <h3 id="h33">0</h3>
                </div>
                <img alt='' src={BG} className='BG'></img>
            </div>
            <div id="desWrapper">
                <div className='desContainer'>
                    <h3>Find Your Group</h3>
                    <img alt='' className='cur' src={EX}></img>
                </div>  
                <div className='desContainer'>
                    <h3>Communicate with your team</h3>
                    <img alt='' className='cur1' src={MIC}></img>
                </div>
                <div className='desContainer'>
                    <h3>Find Users</h3>
                    <img alt='' className='cur' src={NOTES}></img>
                </div>
                <div className='desContainer'>
                    <h3>Explore</h3>
                    <img alt='' className='cur2' src={EX}></img>
                </div>
            </div>
        </div>
    )

}
export default HomePage;