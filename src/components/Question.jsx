import {useState,useEffect,useRef} from "react"



const Question = () => {

    const [q, setQ] = useState([])
    const [count, setCount] = useState(0) 
    const [score, setScore] = useState(0)
    const [num, setNum] = useState(1)
    const Ref = useRef(null)
    const [timer, setTimer] = useState('00:00:00');
    //const [ans, setAns] = useState('')

    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / 1000 / 60 / 60) % 24);
        return {
            total, hours, minutes, seconds
        };
    }

    const startTimer = (e) => {
        let { total, hours, minutes, seconds } 
                    = getTimeRemaining(e);
        if (total >= 0) {
  
            // update the timer
            // check if less than 10 then we need to 
            // add '0' at the beginning of the variable
            setTimer(
                (hours > 9 ? hours : '0' + hours) + ':' +
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            )
        }
    }

    const clearTimer = (e) => {
        setTimer('00:00:10');
        
        if (Ref.current) clearInterval(Ref.current);
        
        const id = setInterval(() => {
            startTimer(e);
            // Check if the timer has reached 0
            if (getTimeRemaining(e).total <= 0) {
                // Move to the next question
                setNum(num => num + 1)
                handeClick();
            }
        }, 1000);
    
        Ref.current = id;
    };
    

    const getDeadTime = () => {
        let deadline = new Date();
  
        // This is where you need to adjust if 
        // you entend to add more time
        deadline.setSeconds(deadline.getSeconds() + 10);
        return deadline;
    }

    useEffect (() => {
        clearTimer(getDeadTime())
        fetch("https://the-trivia-api.com/api/questions?limit=10")
            .then((response) => response.json())
            .then((data) => {
                setQ(data.map((question) => {
                    return ({
                        question: question.question,
                        options: question.incorrectAnswers.concat([question.correctAnswer]).map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value),
                        correct_ans: question.correctAnswer
                    })
                }))
                console.log(data)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handeClick = () => {
        let buttons = document.getElementsByName('options')
        buttons.forEach((button) => {
            button.className="btn"
        });
        setCount(count => count + 1)
        if (count < q.length - 1){
            setNum(num => num + 1)
        }
        clearTimer(getDeadTime())
    }

    const verify = (e) => {
        if (e.target.value === q[count]?.correct_ans){
            setScore(score => score + 1)
        }
        let buttons = document.getElementsByName('options')
        buttons.forEach((button) => {
            if (button.value === q[count]?.correct_ans){
                button.className="btn-correct"
            }
            else{
                button.className="btn-incorrect"  
            }
        });
    }
      

    return (
        <>
        <div className="score-board">
            <h1>Score: {score}/10</h1>
            <h2>{timer}</h2>
        </div>
        <div className="question-counter">
            <h1>Question: {num > 10 ? 10 : num}/10</h1>
        </div>
        <div className="frame">
            <div className="container">
                {count < q.length ? (
                    <>
                    <div id="question-container">
                        <div id="question">{q[count]?.question}</div>
                        <div id="answer-buttons" className="btn-grid">
                            {q[count]?.options?.map((option) => (
                                <button className="btn" value={option} onClick={verify} name="options">{option}</button>
                            ))}
                        </div>
                    </div>
                    <div className="controls">
                        <button id="next-btn" className="next-btn btn" onClick={handeClick}>Next</button>
                    </div>
                    </>
                ) : (<h1 className="finished">Quiz Finished</h1>)}
            </div>
        </div>
        </>
    )
}

export default Question;