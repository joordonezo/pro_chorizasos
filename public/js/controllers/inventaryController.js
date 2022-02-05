const getAllInventory = () => {
    fetch('./getAllInventory', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.getElementById('_token').value
        }
    })
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                currentDataAddQuality.dataModalAddQualityContent = data;
                //pait rows in tableMateriaPrima with data
                let table = document.getElementById('tableMateriaPrima');
                let tbody = table.getElementsByTagName('tbody')[0];
                tbody.innerHTML = '';
                data.forEach(element => {
                    let tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td>${element.id}</td>
                    <td>${element.name}</td>
                    <td>${element.description}</td>
                    <td>${element.typeOfStorage}</td>
                    <td>${element.expirationDate}</td>
                    <td>${element.quantity} Kg</td>
                    <td><button data-bs-toggle="modal" data-bs-target="#modalObservations" class="btn btn-primary" onclick="showObservation(${element.id})" title="Ver historial"><img src="img/icos/list-check.svg"></button></td>
                    <td>
                        <button data-bs-toggle="modal" data-bs-target="#modalAddQuality" class="btn btn-light" onclick="chargeDataRawMaterialsById(${element.id},'+')" title="Añadir de este producto"><img src="img/icos/plus-circle.svg"></button>
                        <button data-bs-toggle="modal" data-bs-target="#modalAddQuality" class="btn btn-light" onclick="chargeDataRawMaterialsById(${element.id},'-')" title="Retirar de este producto"><img src="img/icos/dash-circle.svg"></button>
                    </td>
                    `;
                    tbody.appendChild(tr);
                });


            }
        });
}

const chargeDataRawMaterialsById = (id, operator) => {
    currentDataAddQuality.currentId = id;
    currentDataAddQuality.operator = operator;
    let modal = document.querySelector('#modalAddQualityContent>div');
    let modalTitle = document.querySelector('#modalAddQuality>div>div>div>h5');
    if (operator == '+') {
        modalTitle.innerText = 'Ingreso de cantidad';
    } else {
        modalTitle.innerText = 'Retiro de cantidad';
    }
    let element = currentDataAddQuality.dataModalAddQualityContent.find(element => element.id == id);
    modal.innerHTML = `
    <div class="input-group-text">${element.id}</div>
    <div class="input-group-text">${element.name}</div>
    <div class="input-group-text">${element.typeOfStorage}</div>
    <div class="input-group-text">${element.quantity} Kg</div>
    `;
}
const saveQuantity = () => {
    let currentDate = new Date();
    if (currentDataAddQuality.currentId != null && document.getElementById('inputQuality').value != '') {
        fetch('./saveQuantityById', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.getElementById('_token').value
            },
            body: JSON.stringify({
                id: currentDataAddQuality.currentId,
                quantity: document.getElementById('inputQuality').value,
                operator: currentDataAddQuality.operator,
                concept: document.getElementById('inputConcept').value || '',
                date: getDateFormat(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    let btnModalClose = document.getElementById('btnModalAddQualityClose');
                    btnModalClose.click();
                    document.getElementById('messageSuccessText').innerText = data.success;
                    document.getElementById('messageSuccess').classList.remove('d-none');
                    getAllInventory();
                    setTimeout(() => {
                        document.getElementById('messageSuccess').classList.add('d-none');

                    }, 3000);
                }
            });
    } else {
        alert('Ingrese una cantidad valida');
    }
}

const showObservation = (id) => {
    let observations = currentDataAddQuality.dataModalAddQualityContent.find(element => element.id == id).observation;
    let modal = document.querySelector('#modalObservationsContent>div>table tbody');
    modal.innerHTML = '';
    observations.forEach(item => {
        let tr = document.createElement('tr');
        element = JSON.parse(item.description);
        let config = {
            textOperator: '',
            classOperator: '',
            iconOperator: ''
        }
        if (element.operator == '+') {
            config = {
                textOperator: 'Ingreso',
                classOperator: 'bg-success',
                iconOperator: 'plus-circle'

            }
        } else {
            config = {
                textOperator: 'Retiro',
                classOperator: 'bg-danger',
                iconOperator: 'dash-circle'

            }
        }
        tr.innerHTML = `
    <td>
    <div class="row mb-3 ">
        <div class="input-group justify-content-center">
            <div class="input-group-text">${item.id}</div>
            <div class="input-group-text">${element.description}</div>
            <div class="input-group-text">${element.quantity} Kg</div>
            <div class="input-group-text">${element.date}</div>
            <div class="input-group-text  ${config.classOperator}">${config.textOperator} <img src="img/icos/${config.iconOperator}.svg"></div>
        </div>
    </div>
    </td>
    `;
        modal.appendChild(tr);
    });
}

const saveNewQuantity = () => {
    fetch('./saveNewQuantity', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.getElementById('_token').value
        },
        body: JSON.stringify({
            name: document.getElementById('inputNewName').value,
            description: document.getElementById('inputNewDescription').value || '',
            typeOfStorage: document.getElementById('inputNewTypeOfStorage').value,
            expirationDate: document.getElementById('inputNewDate').value,
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                let btnModalClose = document.getElementById('btnModalAddNewQualityClose');
                btnModalClose.click();
                document.getElementById('messageSuccessText').innerText = data.success;
                document.getElementById('messageSuccess').classList.remove('d-none');
                getAllInventory();
                setTimeout(() => {
                    document.getElementById('messageSuccess').classList.add('d-none');

                }, 3000);
            }
        });

}

