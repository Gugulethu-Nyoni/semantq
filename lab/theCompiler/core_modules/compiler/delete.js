const rootElement = document.createElement('customSyntax');
const span_0 = document.createElement('span');
// Append element to parent
rootElement.appendChild(span_0);
const textNode_0 = document.createTextNode('Hello ');
span_0.appendChild(textNode_0);
const span_1 = document.createElement('span');
// Append element to parent
rootElement.appendChild(span_1);
const textNode_1 = document.createTextNode(' ');
span_1.appendChild(textNode_1);
const mustacheExpr_0 = name;
span_1.appendChild(document.createTextNode(mustacheExpr_0));
const textNode_2 = document.createTextNode(' ');
span_1.appendChild(textNode_2);
const div_2 = document.createElement('div');
// Append element to parent
rootElement.appendChild(div_2);
const table_3 = document.createElement('table');
// Append element to parent
div_2.appendChild(table_3);
// Set attributes
const thead_4 = document.createElement('thead');
// Append element to parent
table_3.appendChild(thead_4);
const tr_5 = document.createElement('tr');
// Append element to parent
thead_4.appendChild(tr_5);
const th_6 = document.createElement('th');
// Append element to parent
tr_5.appendChild(th_6);
const textNode_3 = document.createTextNode('Name ');
th_6.appendChild(textNode_3);
const th_7 = document.createElement('th');
// Append element to parent
tr_5.appendChild(th_7);
const textNode_4 = document.createTextNode('Surname ');
th_7.appendChild(textNode_4);
const th_8 = document.createElement('th');
// Append element to parent
tr_5.appendChild(th_8);
const textNode_5 = document.createTextNode('Email ');
th_8.appendChild(textNode_5);
const tbody_9 = document.createElement('tbody');
// Append element to parent
table_3.appendChild(tbody_9);
const tr_10 = document.createElement('tr');
// Append element to parent
tbody_9.appendChild(tr_10);
const td_11 = document.createElement('td');
// Append element to parent
tr_10.appendChild(td_11);
const textNode_6 = document.createTextNode('Musa  ');
td_11.appendChild(textNode_6);
const td_12 = document.createElement('td');
// Append element to parent
tr_10.appendChild(td_12);
const textNode_7 = document.createTextNode('Moyo ');
td_12.appendChild(textNode_7);
const td_13 = document.createElement('td');
// Append element to parent
tr_10.appendChild(td_13);
const textNode_8 = document.createTextNode('mxmoyo@example.com ');
td_13.appendChild(textNode_8);
const tr_14 = document.createElement('tr');
// Append element to parent
tbody_9.appendChild(tr_14);
const td_15 = document.createElement('td');
// Append element to parent
tr_14.appendChild(td_15);
const textNode_9 = document.createTextNode('James  ');
td_15.appendChild(textNode_9);
const td_16 = document.createElement('td');
// Append element to parent
tr_14.appendChild(td_16);
const textNode_10 = document.createTextNode('Okura ');
td_16.appendChild(textNode_10);
const td_17 = document.createElement('td');
// Append element to parent
tr_14.appendChild(td_17);
const textNode_11 = document.createTextNode('okfuy@website.com ');
td_17.appendChild(textNode_11);
const tr_18 = document.createElement('tr');
// Append element to parent
tbody_9.appendChild(tr_18);
const td_19 = document.createElement('td');
// Append element to parent
tr_18.appendChild(td_19);
// Set attributes
const button_20 = document.createElement('button');
// Append element to parent
td_19.appendChild(button_20);
// Set attributes
const textNode_12 = document.createTextNode('+ ');
button_20.appendChild(textNode_12);
const button_21 = document.createElement('button');
// Append element to parent
td_19.appendChild(button_21);
// Set attributes
const textNode_13 = document.createTextNode('- ');
button_21.appendChild(textNode_13);
const div_22 = document.createElement('div');
// Append element to parent
div_2.appendChild(div_22);
// Set attributes
const form_23 = document.createElement('form');
// Append element to parent
div_22.appendChild(form_23);
// Set attributes
const input_24 = document.createElement('input');
// Append element to parent
form_23.appendChild(input_24);
// Set attributes
const span_25 = document.createElement('span');
// Append element to parent
rootElement.appendChild(span_25);
const textNode_14 = document.createTextNode('Thanks a mil, it\'s an awesome ');
span_25.appendChild(textNode_14);
const span_26 = document.createElement('span');
// Append element to parent
rootElement.appendChild(span_26);
const textNode_15 = document.createTextNode(' ');
span_26.appendChild(textNode_15);
const mustacheExpr_1 = day;
span_26.appendChild(document.createTextNode(mustacheExpr_1));
const textNode_16 = document.createTextNode(' ');
span_26.appendChild(textNode_16);
const span_27 = document.createElement('span');
// Append element to parent
rootElement.appendChild(span_27);
const textNode_17 = document.createTextNode('!.');
span_27.appendChild(textNode_17);

const targetElementId = uniqueid;
const targetElement = document.getElementById(targetElementId);
targetElement.innerHTML='';
targetElement.parentNode.insertBefore(rootElement, targetElement);

