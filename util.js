const settings = require('./settings');
const XLSX = require('excel4node');

const getlang = (langCode) => langCode || settings.DEF_LANG;

const fs = require('fs');
const path = require('path');

const createPath = (fileDir) => path.resolve(__dirname, `${fileDir}`);
const checkLength = (n, min, max) => n >= min && n <= max;

const drugNames = fs.readFileSync(createPath('./assets/drugs_names.txt'), 'utf-8')
                    .replace(/\r/g, '')
                    .split('\n');

const drugNamesExtended = JSON.parse(fs.readFileSync(createPath('./assets/drug_names_extended.json'), 'utf-8'))

const decodeReqToken = (req) => {
    if (!req.headers.authorization) return null;
    const token = req.headers.authorization.split(' ')[1];
    const decodedData = jwt.verify(token, process.env.SECRET);
    return decodedData;
}

const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

const isValidName = (name) => {
    const nameRegex = /^[\p{L}\s'-]+$/u;
    return nameRegex.test(name);
}

const isValidUsername = (username) => {
    const regex = /^[A-Za-z0-9_]+$/;
    return regex.test(username);
}

async function exportPatientsXLSXAsync(patients = [], withFooter = true, withTitle=true, monthIdx = 0, year = 0) {
    return new Promise((resolve, reject) => {
        try {
            const wb = exportPatientsXLSX(patients, withFooter, withTitle, monthIdx, year);
            resolve(wb);
        } catch (err) {
           reject(err);
        }
    });
}

function exportPatientsXLSX(patients = [], withFooter = true, withTitle=true, monthIdx = 0, year = 0) {
    const wb = new XLSX.Workbook();
    const ws = wb.addWorksheet('Sheet 1');

    ws.column(1).setWidth(3.8);
    for (let i = 2; i <= 13; i++)
        ws.column(i).setWidth(8);
    
    let currRow = 1;
    if (withTitle) {
        const titleHeight = 4;
        const titleStyle = wb.createStyle({
            font: {
                name: 'Arial',
                size: 14,
                color: '#000000',
                bold: true
            },
            alignment: {
                horizontal: 'center',
                vertical: 'center',
                wrapText: true
            },
        });
    
        const months = ["yanvar","fevral","mart","aprel","may","iyun","iyul","avqust","sentyabr","oktyabr","noyabr","dekabr"];

        const titleText = `Qusar MRX Publik Hüquqi Şəxs. ${year}-ci ilin ${months[monthIdx]} ayında xəstələrə istifadə olunmuş kimyəvi dərman preparatları haqqında hesabat`;
        ws.cell(1,1,titleHeight,13, true).string(titleText).style(titleStyle);
        currRow += titleHeight;
    }

    const normalStyle = wb.createStyle({
        font: {
            name: 'Arial',
            size: 10,
            color: '#000000'
        },
        alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: true
        },
    });

    const drugStyle = wb.createStyle({
        font: {
            name: 'Arial',
            size: 10,
            color: '#000000'
        },
        alignment: {
            horizontal: 'left',
            vertical: 'center',
            wrapText: true
        },
    });

    const columns = [
        { v: '№',               s: 1, e: 1, name: 'index' },
        { v: 'Xəstənin A.S.A',  s: 2, e: 4, name: 'name' },
        { v: 'Təvəllüd',        s: 5, e: 5, name: 'birthday' },
        { v: 'A/K №',           s: 6, e: 6, name: 'card' },
        { v: 'Müalicə sxemi',   s: 7, e: 8, name: 'scheme' },
        { v: 'Diaqnoz',         s: 9, e: 10, name: 'diagnosis' },
        { v: 'Dərman adı',      s: 11, e: 12, name: 'drugName' },
        { v: 'Sayı',            s: 13, e: 13, name: 'drugCount' }
    ];

    for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        const cell = col.s == col.e ? ws.cell(currRow, col.s) : ws.cell(currRow, col.s, currRow, col.e, true);
        cell.string(col.v).style(normalStyle);
    }
    currRow++;


    for (let i = 0; i < patients.length; i++) {
        const patient = patients[i];
        const rowHeight = Math.max(patient.drugs.length-1, 1);

        const endRow = currRow+rowHeight;

        let col = null;

        col = columns.find(col => col.name == 'index');
        ws.cell(currRow, col.s, endRow, col.e, true)
            .number(i+1)
            .style(normalStyle);
            
        col = columns.find(col => col.name == 'name');
        ws.cell(currRow, col.s, endRow, col.e, true)
            .string(patient.name || '')
            .style(normalStyle);


        col = columns.find(col => col.name == 'birthday');
        const cellBirthday = ws.cell(currRow, col.s, endRow, col.e, true)
            .string(patient.birthday ? patient.birthday.toString() : '')
            .style(normalStyle);

        if (patient.birthday)
            cellBirthday.number(patient.birthday)
        else cellBirthday.string('')


        col = columns.find(col => col.name == 'card');
        const cellCard = ws.cell(currRow, col.s, endRow, col.e, true)
            .string(patient.birthday ? patient.birthday.toString() : '')
            .style(normalStyle);

        if (patient.card)
            cellCard.number(patient.card)
        else cellCard.string('')


        col = columns.find(col => col.name == 'scheme');
        ws.cell(currRow, col.s, endRow, col.e, true)
            .string(patient.scheme || '')
            .style(normalStyle);

        col = columns.find(col => col.name == 'diagnosis');
        ws.cell(currRow, col.s, endRow, col.e, true)
            .string(patient.diagnosis || '')
            .style(normalStyle);

        const patientDrugCount = patient.drugs.length;
        if (patientDrugCount == 0)
            patient.drugs.push({id:-1, amount: 1})

        for (let j = 0; j < patient.drugs.length; j++) {
            const drug = patient.drugs[j];
            if (drug.amount == 0) continue;
            const colDrugName = columns.find(col => col.name == 'drugName');
            const colDrugCount = columns.find(col => col.name == 'drugCount');
            const drugEndRow = drug.id == -1 ? endRow : currRow+j + (patientDrugCount == 1);

            ws.cell(currRow+j, colDrugName.s, drugEndRow, colDrugName.e, true)
                .string(drug.id == -1 ? '' : drugNames[drug.id])
                .style(drugStyle);

            const cellDrugCount = ws.cell(currRow+j, colDrugCount.s, drugEndRow, colDrugCount.e, true)
                .style(normalStyle);

            if (drug.id == -1)
                cellDrugCount.string('')
            else cellDrugCount.number(drug.amount)

        }

        currRow = endRow+1;
    }
        
    return wb;
}

module.exports = {
    getlang, drugNames, drugNamesExtended, checkLength, decodeReqToken, isValidEmail, isValidName, isValidUsername,
    exportPatientsXLSX, exportPatientsXLSXAsync
}