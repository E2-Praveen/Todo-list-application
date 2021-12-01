// select elements in DOM
const form = document.querySelector("#itemForm");
const itemInput = document.querySelector("#itemInput");
const itemList = document.querySelector("#itemList");
const filters = document.querySelectorAll(".nav-item");
const addbtn = document.querySelector(".addbutton");

// create empty item list
let todoItems = [];

// filter tab items
const getItemsFilter = function (type) {
    let filterItems = [];
    console.log(type);
    switch (type) {
        case "todo"://todo
            filterItems = todoItems.filter((item) => !item.isDone);
            break;
        case "done"://completed
            filterItems = todoItems.filter((item) => item.isDone);
            break;
        default://all
            filterItems = todoItems;
    }
    getList(filterItems);
};

// update item
const updateItem = function (itemIndex, newValue) {
    console.log(itemIndex);
    const newItem = todoItems[itemIndex];
    newItem.name = newValue;
    todoItems.splice(itemIndex, 1, newItem);
    setLocalStorage(todoItems);
};

// remove/delete item
const removeItem = function (itemData) {
    const removeIndex = todoItems.indexOf(itemData);
    todoItems.splice(removeIndex, 1);
    setLocalStorage(todoItems);
};

//2
//bi-check-circle-fill  // bi-check-circle
// handle item
const handleItem = function (itemData) {
    const items = document.querySelectorAll(".list-group-item");
    items.forEach((item) => {
        if (item.querySelector(".title").getAttribute("data-time") == itemData.addedAt) {
            // done
            item.querySelector("[data-done]").addEventListener("click", function (e) {
                e.preventDefault();
                const itemIndex = todoItems.indexOf(itemData);
                const currentItem = todoItems[itemIndex];
                const currentClass = currentItem.isDone ? "bi-check-circle-fill" : "bi-check-circle";
                currentItem.isDone = currentItem.isDone ? false : true;
                todoItems.splice(itemIndex, 1, currentItem);

                setLocalStorage(todoItems);

                const iconClass = currentItem.isDone ? "bi-check-circle-fill" : "bi-check-circle";
                this.firstElementChild.classList.replace(currentClass, iconClass);
                const filterType = document.querySelector("#filterType").value;
                getItemsFilter(filterType);
            });
            
            // edit
            item.querySelector("[data-edit]").addEventListener("click", function (e) {
                e.preventDefault();
                itemInput.value = itemData.name;
                addbtn.innerHTML = "SAVE TASK";
                document.querySelector("#citem").value = todoItems.indexOf(itemData);
                return todoItems;
            });
            addbtn.innerHTML = "ADD TASK";

            //delete
            item
                .querySelector("[data-delete]")
                .addEventListener("click", function (e) {
                    e.preventDefault();
                    itemList.removeChild(item);
                    removeItem(itemData);
                    setLocalStorage(todoItems);
                    return todoItems.filter((item) => item != itemData);
                });
        }
    });
};

//3
// get list items
const getList = function (todoItems) {
    itemList.innerHTML = "";
    if (todoItems.length > 0) {
        todoItems.forEach((item) => {
            const iconClass = item.isDone ? "bi-check-circle-fill" : "bi-check-circle";
            itemList.insertAdjacentHTML(
                //"beforeend" - Before the end of the element (as the last child)
                "beforeend",
                `<li class="list-group-item">
          <span class="title" data-time="${item.addedAt}">${item.name}</span> 
          <span class="icons">
              <a href="#" data-done><i class="bi ${iconClass} green"></i></a>
              <a href="#" data-edit><i class="fas fa-edit"></i></a>
              <a href="#" data-delete><i class="fas fa-trash-alt"></i></a>
          </span>
        </li>`
            );
            handleItem(item);
        });
    } else {
        itemList.insertAdjacentHTML(
            "beforeend",
            `<li class="list-group-item">
        No record found.
      </li>`
        );
    }
};

// get localstorage from the page
const getLocalStorage = function () {
    const todoStorage = localStorage.getItem("todoItems");
    if (todoStorage === "undefined" || todoStorage === null) {
        todoItems = [];
    } else {
        todoItems = JSON.parse(todoStorage);

    }
    getList(todoItems);
};

// set list in local storage
const setLocalStorage = function (todoItems) {
    localStorage.setItem("todoItems", JSON.stringify(todoItems));
};

//1. add list item
document.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const itemName = itemInput.value.trim();

        //To avoid Empty list item
        if (itemName.length === 0) {
            alert("Enter the Task");
            return;
        } else {
            // update existing Item
            const currenItemIndex = document.querySelector("#citem").value;
            if (currenItemIndex) {
                updateItem(currenItemIndex, itemName);
                document.querySelector("#citem").value = "";
            } else {
                // Add new Item
                const itemObj = {
                    name: itemName,
                    isDone: false,
                    addedAt: new Date().getTime(),
                };
                todoItems.push(itemObj);
                location.reload();
                // set local storage
                setLocalStorage(todoItems);
            }

            getList(todoItems);
            // get list of all items
        }
        // console.log(todoItems);
        itemInput.value = "";
    });

    // filters
    //tab active or not
    filters.forEach((tab) => {
        tab.addEventListener("click", function (e) {
            e.preventDefault();
            const tabType = this.getAttribute("data-type");
            document.querySelectorAll(".nav-link").forEach((nav) => {
                nav.classList.remove("active");

            });
            this.firstElementChild.classList.add("active");
            document.querySelector("#filterType").value = tabType;
            getItemsFilter(tabType);
        });

    });

    // load items
    getLocalStorage();
});
