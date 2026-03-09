function submitDoubt() {

let input = document.getElementById("doubtInput")

let list = document.getElementById("doubtList")

let li = document.createElement("li")

li.innerText = input.value

list.appendChild(li)

input.value = ""

}