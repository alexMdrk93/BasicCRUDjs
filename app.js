const showHero = document.querySelector('.displayEroi');
const erouPrint = document.querySelector('.erouPrint');
const addHero = document.querySelector('#createHero');

const urlRoot = 'http://localhost:3000';
const heroItem = [];
let output = '';

class heroList {
    constructor(
      id,
      nume,
      prenume,
      numeDeErou,
      numeSuper
    ) {
      this.id = id;
      this.nume = nume;
      this.prenume = prenume;
      this.numeDeErou = numeDeErou;
      this.numeSuper = numeSuper;
    }
    showData(){
        return[
            this.id,
            this.nume,
            this.prenume,
            this.numeDeErou,
            this.numeSuper
        ];
    }
}

const HeroHTMLCard = (hero) => {
return `
    <div class="card m-2" style="width: 18rem;">
    <div class="card-header">
        ${hero.numeDeErou}
    </div>
    <ul class="list-group list-group-flush">
        <li class="list-group-item">Nume actor: ${hero.nume}</li>
        <li class="list-group-item">Prenume actor: ${hero.prenume}</li>
        <li class="list-group-item">Superputere: ${hero.SuperPowers[0].numeSuper}</li>
    </ul>
    </div>
    <button type="button" class="btn btn-primary updateBtn" data-bs-toggle="modal" data-bs-target="#editHero" id="hero-updatebtn-${hero.id}">Update</button>
    <button type="button" class="btn btn-danger deleteBtn" id="hero-deletebtn-${hero.id}">Delete</button>
`
}

const editHeroForm = (hero) => {
    return `
        <form>
            <div class="mb-3">
                <label for="formGroupExampleInput" class="form-label">Nume actor</label>
                <input type="text" class="form-control" id="nume" value="${hero.nume}"">
            </div>
            <div class="mb-3">
                <label for="formGroupExampleInput2" class="form-label">Prenume actor</label>
                <input type="text" class="form-control" id="prenume" value="${hero.prenume}">
            </div>
            <div class="mb-3">
                <label for="formGroupExampleInput" class="form-label">Nume erou</label>
                <input type="text" class="form-control" id="numeDeErou" value="${hero.numeDeErou}">
            </div>
            <div class="mb-3">
                <label for="formGroupExampleInput2" class="form-label">Superputere</label>
                <input type="text" class="form-control" id="superputere" value="${hero.numeSuper}">
            </div>
                <button type="submit" class="btn btn-primary submitBtn">Submit</button>
        </form>
        `
}

const editFlowSequence = (event) => {
    const id = Number(event.target.id.split('-').at(-1));
    console.log(event);
    const selectedHero = heroItem.find((hero) => hero.id === id);
    const insertForm = document.getElementById('insertForm');
    insertForm.innerHTML = editHeroForm(selectedHero);
    const submitForm = document.querySelector('.submitBtn')
    submitForm.addEventListener('click', function(){submitHeroChanges(id)});
}

function submitHeroChanges(id){
    const form = document.querySelector('#insertForm form');
    const nume = form[0].value;
    const prenume = form[1].value;
    const numeDeErou = form[2].value;
    const numeSuper = form[3].value;
    const URLpatchH = `http://localhost:3000/Heroes/${id}`;
    const URLpatchSp = `http://localhost:3000/SuperPowers/${id}`
    const fetchH = fetch(URLpatchH, {
        method: "PATCH",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({
            nume,
            prenume,
            numeDeErou
        }),
    });
    const fetchSp = fetch(URLpatchSp, {
        method: 'PATCH',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            numeSuper
        })
    });
    Promise.all([fetchH, fetchSp])
    .then(getResponse());
}

const deleteFlow = (event) => {
    const id = Number(event.target.id.split('-').at(-1));
    const fetchDelH = fetch(`${urlRoot}/Heroes/${id}`, {method: 'DELETE'});
    const fetchDelSp = fetch(`${urlRoot}/SuperPowers/${id}`, {method: 'DELETE'});
    Promise.all([fetchDelH, fetchDelSp])
        .then(getResponse());
}

const addHeroFn = (event) => {
    const form = document.querySelector('#createHeroForm');
    const nume = form[0].value;
    const prenume = form[1].value;
    const numeDeErou = form[2].value;
    const numeSuper = form[3].value;
    const URLpostH = `http://localhost:3000/Heroes/`;
    const URLpostSp = `http://localhost:3000/SuperPowers/`
    const fetchH = fetch(URLpostH, {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({
            nume,
            prenume,
            numeDeErou
        }),
    });
    const fetchSp = fetch(URLpostSp, {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            numeSuper
        })
    });
    Promise.all([fetchH, fetchSp])
    .then(getResponse());
}

const getResponse = response => response.json();
const processJSON = json => {
    output = ''
    json.forEach(hero => {
        heroItem.push(
            new heroList(
                hero.id,
                hero.nume,
                hero.prenume,
                hero.numeDeErou,
                hero.SuperPowers[0].numeSuper
            )
        );
        output += HeroHTMLCard(hero) 
    });
          
    erouPrint.innerHTML = output;
    const allUpdate = document.querySelectorAll('.updateBtn');
        allUpdate.forEach(function(button) {
            button.addEventListener('click', editFlowSequence)
            });
    const allDelete = document.querySelectorAll('.deleteBtn');
        allDelete.forEach(function(button) {
            button.addEventListener('click', deleteFlow);
})
}
    
showHero.addEventListener('click', () => {
    fetch(`${urlRoot}/Heroes/?_embed=SuperPowers`, {method: 'GET'})
        .then(getResponse)
        .then(processJSON)
});

addHero.addEventListener('click', addHeroFn);