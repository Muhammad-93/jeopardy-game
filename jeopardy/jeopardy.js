// categories is the main data structure for the app; it looks like this:
// let indx = dummyData[0].clues[1].showing



//  let dummyData = [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
       
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
       
//      ]
//    },]


let categories = [];
const NUM_CATEGORIES = 6;
const NUM_QUESTIONS_PER_CAT = 5

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

 async function getCategoryIds() {
    const response = await axios.get('http://jservice.io/api/categories?count=90');
    const randomCategories = _.sampleSize(response.data, [n = 6]);
    console.log(randomCategories);

    let categoryIds = randomCategories.map(category => category.id)
    console.log(categoryIds)
    return categoryIds;
}
// getCategoryIds();



/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */   

//  let dummyData = array[2]

async function getCategory(catId){
        let response = await axios.get(
            `http://jservice.io/api/category?id=${catId}`);
        
            console.log(response)
    
            let title = response.data.title;
            console.log(title)
            // let clue = response.data.clues;
            let clue = response.data
            let Cl = clue.clues.map(results => {
                let q = results.question;
                let a = results.answer;
                return {
                    question: q,
                    answer: a,
                    showing: null,
                }
            });
            console.log(Cl);
            return {title, clues: Cl};
    } ;

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

// th = header column/cell
// td = table body column/cell
// tr = row
// thead = table head

async function fillTable() {
    let table = $( "#jeopardy" )
    table.append('<thead><tr>' + categories.map(category => `<th>${category.title}</th>`) + '</tr></thead>')
    let columns = '<td>?</td>'.repeat(NUM_CATEGORIES)
    let rows = `<tr>${columns}</tr>`.repeat(NUM_QUESTIONS_PER_CAT)
    table.append(`<tbody>${rows}</tbody>`)

    $("td").on("click", handleClick);
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

 function handleClick(evt) {
     let columnIndex = evt.target.cellIndex
     let rowIndex = evt.target.parentElement.rowIndex - 1
     let showing = categories[columnIndex].clues[rowIndex].showing
     let  question = categories[columnIndex].clues[rowIndex].question
     let  answer = categories[columnIndex].clues[rowIndex].answer

     if( showing == null) {
        categories[columnIndex].clues[rowIndex].showing = "question"
         evt.target.innerText = question
     }
     else if ( showing == "question"){
        categories[columnIndex].clues[rowIndex].showing = "answer"
         evt.target.innerText = answer
     }
 
    }
// attach listner to object
  

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

async function restartGame() {
    $( "#jeopardy" ).html('')
    categories = []
    await setupAndStart();
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {

   let categoryIds = await getCategoryIds();
   for (let i = 0; i < categoryIds.length; i++) {
        categories.push(await getCategory(categoryIds[i]))
   }

   fillTable()
}

/** On click of start / restart button, set up game. */
$("body").append("<table id='jeopardy'></table>")
$("body").append("<button id='restart'>Restart</button>")
$("#restart").on("click", restartGame);