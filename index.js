//code here
let hardBtn = document.querySelector('#hard')
let mediumBtn = document.querySelector('#medium')
let easyBtn = document.querySelector('#easy')
let scoreDiv = document.querySelector('#score')
let scoreForm = document.querySelector('#save-score')
let questionDiv = document.querySelector('#selection')
scoreForm.addEventListener('submit', handleSubmit)
hardBtn.addEventListener('click', handleDifficulty)
mediumBtn.addEventListener('click', handleDifficulty)
easyBtn.addEventListener('click', handleDifficulty)
hardBtn.addEventListener('mouseover', handleMouseEvent)
hardBtn.addEventListener('mouseout', handleMouseEvent)
mediumBtn.addEventListener('mouseover', handleMouseEvent)
mediumBtn.addEventListener('mouseout', handleMouseEvent)
easyBtn.addEventListener('mouseover', handleMouseEvent)
easyBtn.addEventListener('mouseout', handleMouseEvent)


let answeredCorrectly = 0
let totalAnswered = 0
let answerObj = {}
let currentId = 0

function handleDifficulty(e) {
    e.preventDefault()
    switch(e.target.id) {
        case 'hard':
            hardBtn.innerText  = 'Hard Selected'
            mediumBtn.innerText = 'Medium'
            easyBtn.innerText  = 'Easy'
            break
        case 'medium':
            hardBtn.innerText  = 'Hard'
            mediumBtn.innerText = 'Medium Selected'
            easyBtn.innerText  = 'Easy'
            break
        case 'easy':
            hardBtn.innerText  = 'Hard'
            mediumBtn.innerText = 'Medium'
            easyBtn.innerText  = 'Easy Selected'
            break
    }

    answeredCorrectly = 0
    totalAnswered = 0
    questionDiv.replaceChildren()
    difficulty = e.target.id
    getAllQuestions()
    
}

function getAllQuestions() {
    fetch("http://localhost:3000/results")
        .then(resp => resp.json())
        .then(data => {
            for (el of data) {
                if (el.difficulty === difficulty)
                    getQuestionById(el.id)

                answerObj[el.id] = el.correct_answer
            }
        }


        )
}

function getQuestionById(id) {
    fetch(`http://localhost:3000/results/${id}`)
        .then(res => res.json())
        .then(question => renderOneQuestion(question))
}

function renderOneQuestion(q) {
    //places correct answer at a random spot in the array
    let answers = []
    q.incorrect_answers.forEach(el => answers.push(el))
    answers.splice((answers.length + 1) * Math.random() | 0, 0, q.correct_answer)
    let card = document.createElement('div')
    card.className = 'card'
    card.innerHTML = `
  <h2 id="${q.id}">${q.question}</h2> 

  `
    let select = document.createElement('select')
    let option = document.createElement('option')
    option.innerText = 'Select Answer'
    select.append(option)


    for (let el of answers) {
        let option = document.createElement('option')
        option.innerText = el
        select.append(option)

    }
    let likeBtn = document.createElement('button')
    likeBtn.innerText = 'Like ♥'
    likeBtn.addEventListener('click', handleLike)
    card.appendChild(select)
    card.appendChild(likeBtn)
    questionDiv.appendChild(card)
    select.addEventListener('change', handleAnswer)
}

function handleAnswer(e) {
    e.preventDefault()
    currentId = e.target.parentElement.children[0].id
    checkAnswer(e.target.value)
    e.target.disabled = true

}

function checkAnswer(a) {
    totalAnswered = totalAnswered + 1
    let question = document.getElementById(`${currentId}`)
    if (a === answerObj[currentId]) {
        answeredCorrectly = answeredCorrectly + 1
        question.style.color = '#2dba4e'
    } else {
        question.style.color = 'red'
    }
    updateScore()
}

function handleLike(e) {
    e.preventDefault()
    if (e.target.style.color != 'red') {
        e.target.style.color = 'red'
    } else {
        e.target.style.color = 'black'
    }

}

function handleMouseEvent(e) {

    if (e.type === 'mouseover') {
        e.target.style.color = 'red'
    } else if (e.type === 'mouseout') {
        e.target.style.color = 'black'

    }
}

function updateScore() {
    scoreDiv.innerText = `Score: ${answeredCorrectly} / ${totalAnswered}`
}

function handleSubmit(e) {
    e.preventDefault()
    newName = scoreForm.querySelector('#new-score').value
    addNewScore(newName)
    scoreForm.reset()
}

function addNewScore(newName) {
    let newScore = document.createElement('h2')
    const str = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    newScore.innerText = `${newName}-${str}-${answeredCorrectly} / ${totalAnswered}`
    scoreForm.append(newScore)

}