import config from './config.js';
import { Api } from './handleApi.js';
import { basket } from './basket.js';

class CreateItems {
    constructor() {
        this.api = new Api();
        this.admin = new Api();
        this.basket = basket;
    }

    createMessageElement(message) {
        const aside = document.createElement('aside');
        aside.className = "message";
        const paragraph = document.createElement('p');
        paragraph.innerText = message;
        aside.appendChild(paragraph);
        return aside
    }

    productsShop(arrayProducts) {
        return arrayProducts.map(product => {
            const articleContainer = document.createElement('article');
            articleContainer.dataset.id = product._id;
            articleContainer.className = 'product';
            articleContainer.dataset.tags = typeof product.tags === 'object' ? product.tags.join(" ") : product.tags;
            articleContainer.dataset.category = product.category;
            this._createProductShop(product, articleContainer);
            return articleContainer;
        })

    }
    _createProductShop(product, articleContainer) {
        const { name, description, price, count, image, category } = product;
        const imageHTML = this._createElement('img', { alt: name, src: image });
        const spanImg = this._createElement('span', { class: 'ImgContainer' });
        spanImg.appendChild(imageHTML)

        const nameElement = document.createElement('h1');
        nameElement.innerText = name;

        const priceElement = document.createElement('p');
        priceElement.innerText = `Cena: ${price}`;

        const descriptionElement = document.createElement('p');
        descriptionElement.className = "descriptionProduct";
        descriptionElement.innerText = description;

        const countElement = document.createElement('p');
        countElement.innerText = `Dostępnych: ${count}`;

        const buttonContainer = document.createElement('div');
        const addBasketBtn = document.createElement('button');
        addBasketBtn.innerText = 'dodaj do koszyka';

        addBasketBtn.addEventListener('click', (e) => {
            e.stopImmediatePropagation()
            this.basket.addToBasket(articleContainer.dataset.id)
        })
        buttonContainer.appendChild(addBasketBtn);

        articleContainer.append(spanImg);
        articleContainer.append(nameElement);
        articleContainer.append(priceElement);
        articleContainer.append(descriptionElement);
        articleContainer.append(countElement);
        articleContainer.append(buttonContainer);
        return articleContainer;
    }

    createTableAdmin() {
        const listContainer = document.createElement('table');

        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const headerTable = document.createElement('tr');

        const headerTableName = document.createElement('th');
        headerTableName.innerText = "Produkt";

        const headerTableCount = document.createElement('th');
        headerTableCount.innerText = "Ilość";

        const headerTablePrice = document.createElement('th');
        headerTablePrice.innerText = "Cena";

        const headerTableId = document.createElement('th');
        headerTableId.innerText = "Id";

        const headerTableDesc = document.createElement('th');
        headerTableDesc.innerText = "Opis";

        const headerTableImg = document.createElement('th');
        headerTableImg.innerText = "Zdjęcie";

        const headerTableTags = document.createElement('th');
        headerTableTags.innerText = "Tagi";
        const headerTableCategory = document.createElement('th');
        headerTableCategory.innerText = "Kategoria";

        headerTable.appendChild(headerTableName);
        headerTable.appendChild(headerTableCount);
        headerTable.appendChild(headerTablePrice);
        headerTable.appendChild(headerTableId);
        headerTable.appendChild(headerTableTags);
        headerTable.appendChild(headerTableCategory);
        headerTable.appendChild(headerTableImg);
        headerTable.appendChild(headerTableDesc);
        thead.appendChild(headerTable);

        listContainer.appendChild(thead);
        listContainer.appendChild(tbody);
        return listContainer;
    }
    _createElement(tag, attrs) {
        const element = document.createElement(tag);
        for (let attr in attrs) {
            element.setAttribute(attr, attrs[attr])

        }
        return element
    }

    adminProduct(product) {

        let active = false;
        const tr = this._createElement('tr');

        const name = this._createElement('td');
        const nameInput = this._createElement('input', { disabled: true, value: product.name });
        name.appendChild(nameInput);

        const count = this._createElement('td');
        const countInput = this._createElement('input', { disabled: true, type: "number", value: product.count });
        count.appendChild(countInput);

        const price = this._createElement('td');
        const priceInput = this._createElement('input', { disabled: true, type: "number", value: product.price });
        price.appendChild(priceInput);

        const id = this._createElement('td');
        id.innerText = product._id;

        const desc = this._createElement('td');
        const descInput = this._createElement('input', { disabled: true, value: product.description });
        desc.appendChild(descInput);


        const imgTd = this._createElement('td', { class: 'imageCell' });
        const img = this._createElement('img', { src: product.image, alt: product.name });

        const imgInput = this._createElement('input', { disabled: true, type: "file" });

        imgTd.appendChild(img);
        imgTd.appendChild(imgInput);

        const tags = this._createElement('td', { class: "adminTagsProduct" });
        const tagElementsHTMLar = this.adminTags(product);
        tagElementsHTMLar.forEach(tag => tags.appendChild(tag));

        const category = document.createElement('td');
        const categorySelect = this._createElement('select', { disabled: true, name: 'category' });
        categorySelect.setAttribute("disabled", true);

        const categoryElementsHTMLar = this.adminCaregory(product);
        categoryElementsHTMLar.forEach(option => categorySelect.appendChild(option));
        category.appendChild(categorySelect)

        const modifierBtnTd = document.createElement('td');
        const modifierBtn = document.createElement('button');
        modifierBtn.innerText = "Odblokuj";
        modifierBtn.classList.add('active');
        modifierBtn.addEventListener('click', () => {
            if (active) {
                const data = {
                    name: nameInput.value,
                    count: countInput.value,
                    price: priceInput.value,
                    description: descInput.value,
                    category: categorySelect.value,
                    image: imgInput.files[0] ? imgInput.files[0] : undefined,
                    tags: this._getTags(tags.querySelectorAll('input[type="checkbox"]')),

                }

                this.api.change(product._id, data)
                    .catch(err => this.createMessage('błąd przy próbie modyfikacji produktu'))
            }
            active = !active;
            modifierBtn.classList.toggle('active');
            !active ? modifierBtn.innerText = "Odblokuj" : modifierBtn.innerText = "Zatwierdź";
            !active ? countInput.setAttribute("disabled", true) : countInput.removeAttribute('disabled');
            !active ? descInput.setAttribute("disabled", true) : descInput.removeAttribute('disabled');
            !active ? nameInput.setAttribute("disabled", true) : nameInput.removeAttribute('disabled');
            !active ? priceInput.setAttribute("disabled", true) : priceInput.removeAttribute('disabled');
            !active ? imgInput.setAttribute("disabled", true) : imgInput.removeAttribute('disabled');
            !active ? countInput.setAttribute("disabled", true) : countInput.removeAttribute('disabled');
            !active ? categorySelect.setAttribute("disabled", true) : categorySelect.removeAttribute('disabled');
            !active ? tagElementsHTMLar.forEach(element => (
                this.switchBlockTags(element.querySelector('input'), "add"))
            ) : tagElementsHTMLar.forEach(element => (
                this.switchBlockTags(element.querySelector('input'), "remove"))
            )

        })
        modifierBtnTd.appendChild(modifierBtn);

        ////////////////przeniesc gdzie indziej funkcje
        const removeBtnTd = document.createElement('td');
        const removeBtn = document.createElement('button');
        removeBtn.innerText = "Usuń";
        removeBtn.addEventListener('click', () => {
            const isConfirm = confirm("czy na pewno chcesz usunąć produkt?");
            if (!isConfirm) return
            try {
                this.api.remove(product._id)
                    .then(response => tr.remove())
                    .catch(err => console.log('błąd połączenia'))
            } catch{
                console.log('błąd podczas usuwania produktu')
            }
        })
        removeBtnTd.appendChild(removeBtn);

        tr.appendChild(name);
        tr.appendChild(count);
        tr.appendChild(price);
        tr.appendChild(id);
        tr.appendChild(tags);
        tr.appendChild(category);
        tr.appendChild(imgTd);
        tr.appendChild(desc);
        tr.appendChild(modifierBtnTd);
        tr.appendChild(removeBtnTd);
        return tr;
    }

    _getTags(tagsHtml) {
        const arr = []
        tagsHtml.forEach(tagHTML => {
            if (tagHTML.checked) {
                arr.push(tagHTML.getAttribute('name'));
            }
        })
        return arr
    }
    //  <option value="beads">Koraliki</option>
    adminCaregory(product) {
        return config.category.map(singleCategory => {
            const option = document.createElement('option');
            for (let element in singleCategory) {
                option.setAttribute('value', element)
                option.text = singleCategory[element]
                if (element === product.category) {
                    option.setAttribute('selected', true)
                }
            }

            return option
        })
    }

    switchBlockTags(element, option) {
        if (option === "remove") element.removeAttribute('disabled');
        if (option === "add") element.setAttribute('disabled', true);
    }

    adminTags(product) {
        return config.tags.map(tag => {
            const tagId = product.name + product._id;
            const singleTag = document.createElement('span');
            const checkbox = this._createElement('input', { type: 'checkbox', disabled: true, name: tag, id: tagId })

            const isChecked = typeof product.tags === 'string' ? product.tags : product.tags.filter(checkedProductTag => checkedProductTag === tag)
            isChecked.length !== 0 ? checkbox.setAttribute('checked', 'true') : ""

            const label = this._createElement('label', { for: tagId, })
            label.innerText = tag;
            singleTag.appendChild(checkbox);
            singleTag.appendChild(label);
            return singleTag;
        })
    }
    createMessage(text) {
        const bgcMessage = document.createElement('div');
        bgcMessage.classList.add('errorMessage');
        const message = document.createElement('p');
        message.innerText = text ? text : 'Wystąpiły problemy techniczne. Pracujemy nad ich rozwiązaniem';
        const btnClose = document.createElement('button');
        const x = '&#9747'
        btnClose.innerHTML = x;

        btnClose.addEventListener('click', () => document.body.removeChild(bgcMessage));
        message.append(btnClose)
        bgcMessage.append(message);
        document.body.append(bgcMessage);
    }
    addTagsToAddPanel() {
        return config.tags.map(tag => {
            const tagId = `addPanel${tag}`;
            const singleTag = document.createElement('span');

            const checkbox = this._createElement('input', { type: 'checkbox', name: 'tags', value: tag, id: tagId })

            const label = this._createElement('label', { for: tagId, });
            label.innerText = tag;
            singleTag.appendChild(checkbox);
            singleTag.appendChild(label);
            return singleTag;
        })
    }

    createLoader() {
        this.loader = document.createElement('div');
        this.loader.classList.add('loader');
        return this.loader;
    }
    removeLoader() {
        document.querySelectorAll('.loader').forEach(loader => {
            loader.parentNode.removeChild(loader);
        })
    }

}
export default new CreateItems();