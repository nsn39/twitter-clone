import { useNavigate } from 'react-router-dom';

function Tweet(props) {
    const navigate = useNavigate();

    let handleClick = () => {
        navigate("/tweet/" + props.id)
    }

    // convert utc timestamp into local timestamp
    const timestampObj = new Date(props.originalTimestamp);
    const timestampValue = timestampObj.valueOf();
    const localTimestamp = new Date(timestampValue);
    const localTimestampString = localTimestamp.toString().slice(0, 25);

    return (
        <div className="flex flex-row border-b border-slate-300 hover:bg-slate-200 p-3 cursor-pointer" onClick={handleClick}>
            <img className='flex-none h-10 w-10 rounded-full mr-2' src='/lex.jpeg' />
            <div className='flex-grow'>
                <div className="flex flex-row items-center">
                    <p className="font-bold hover:underline mr-1">
                        <a href="./">{props.displayName}</a> 
                    </p>
                    <p className="flex flex-row text-base text-gray-400 mr-1">
                        <p className='mr-1'>&bull;</p><a href="./">{props.userName }</a>
                    </p>
                    <p className='text-sm text-gray-400'> &bull; {localTimestampString}</p>
                </div>
                <p className="border-b-200">{props.tweetText}</p>
            </div>
        </div>
    )
}

export default Tweet;

//Userno.1
//@userno1
//The most dumbest thing I've heard in my life.
//TODO
//1. active link bold in navbar
//2. gray color when hover over tweet
//3. make tweets clickable
//4. very thin border

//5.tweet post page
//6.search interactive with dummy results
//7.add date metadata to tweet
//8.complete other pages (profile, explore, messages etc.)
//9.expand what's happening sidebar and add people you may follow
//10.add SVG elements in the pages.
//11.make the recent tweet come on top.
//12.add dummy DPs. (in what's happening input element and others.)

//(everyting single profile at this point.)
//13.implement login/signup pages and authentication on both BE&FE.
//14.data structures for different profiles.
//15.show dummy data for different profiles.
//16.fix 60% zoom css responsive error (just seems weird)
//(start working on backend)
//17.work on likes, retweets, quote tweets, notifications, messages etc.
//18.implement authentication on both FE and BE.