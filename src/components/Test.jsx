import {useEffect} from "react"
import {useState} from "react"

const Test = () => {

    const [q, setQ] = useState([])
    const [count, setCount] = useState(0)

    useEffect (() => {
            fetch("https://the-trivia-api.com/api/questions?limit=10")
                .then((response) => response.json())
                .then((data) => {
                    setQ(data.map((question) => {
                        return ({
                            question: question.question,
                            options: question.incorrectAnswers.concat([question.correctAnswer]).map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value)
                        })
                    }))
                    console.log(data)
                })
    }, [])


    return (
        <div>
            {q && (
                <div>
                    <h1>{q[count]?.question}</h1>
                    <ul>
                        {q[count]?.options?.map((option) => (
                            <li>{option}</li>
                        ))}
                    </ul>
                    <button onClick={() => setCount(count+1)}>Next!</button>
                </div>
            )}
        </div>
    ) 
}

export default Test;