window.onload = () => {
    let products = JSON.parse(localStorage.getItem('products'));
    let targetCalories = parseInt(localStorage.getItem('targetCalories'))
    let totalCalories = parseInt(localStorage.getItem('totalCalories'))

    const updateLocalStorage = (products) => {
        localStorage.setItem('products', JSON.stringify(products));
    };

    const editTarget = () => {
        let target = prompt('Write your target calories', 1500);
        localStorage.setItem('targetCalories', +target);
        document.getElementById('target-count').textContent = +target;
    }

    if (targetCalories === null) {
        localStorage.setItem('targetCalories', 1500);
        document.getElementById('target-count').textContent = localStorage.getItem('targetCalories');
    } else {
        document.getElementById('target-count').textContent = localStorage.getItem('targetCalories');
    }

    if (totalCalories === null || isNaN(totalCalories)) {
        totalCalories = 0;
        localStorage.setItem('totalCalories', totalCalories);
        document.getElementById('total-count').textContent = totalCalories;
    } else {
        document.getElementById('total-count').textContent = parseInt(localStorage.getItem('totalCalories'));
    }    

    const createProductBlock = (product) => {
        document.getElementById('calories-chart').style.display = 'block';
        totalCalories += +product.calorie;
        localStorage.setItem('totalCalories', totalCalories);
        document.getElementById('total-count').textContent = totalCalories;
        document.querySelectorAll('.calories')[0].style.display = 'block';
        document.querySelectorAll('.calories')[1].style.display = 'block';
        if (totalCalories > targetCalories) {
            alert('You have exceeded your daily calorie intake')
        }
        const productBlock = document.createElement('div');
        productBlock.classList.add('product-block');
        const productImage = document.createElement('img');
        productImage.src = product.url;
        productImage.alt = product.name + ' image';
        productBlock.appendChild(productImage);
        const productName = document.createElement('h3');
        productName.textContent = product.name;
        productBlock.appendChild(productName);
        const productCalorie = document.createElement('p');
        productCalorie.textContent = 'Calorie: ' + product.calorie;
        productBlock.appendChild(productCalorie);
        const productQuantity = document.createElement('p');
        productQuantity.textContent = 'Quantity: ' + product.quantity; // Выводим количество продукта
        productBlock.appendChild(productQuantity);
        const buttons = document.createElement('div');
        buttons.classList.add('product-buttons');
        productBlock.appendChild(buttons);
        const plus = document.createElement('button');
        plus.textContent = '+';
        buttons.appendChild(plus);
        const minus = document.createElement('button');
        minus.textContent = '-'; // Исправляем ошибку - добавляем минус кнопке
        buttons.appendChild(minus);
        const deleteButton = document.createElement('button'); 
        deleteButton.textContent = 'Delete';
        productBlock.appendChild(deleteButton);
        plus.style.marginRight = '1%';

        plus.addEventListener('click', () => {
            product.quantity += 1;
            productQuantity.textContent = 'Quantity: ' + product.quantity;
            productCalorie.textContent = 'Calorie: ' + product.calorie * product.quantity;
            updateLocalStorage(products);
            totalCalories += +product.calorie;
            localStorage.setItem('totalCalories', totalCalories);
            document.getElementById('total-count').textContent = totalCalories;
            if (totalCalories > targetCalories) {
                alert('You have exceeded your daily calorie intake')
            }
        });

        minus.addEventListener('click', () => {
            if (product.quantity > 1) {
                product.quantity -= 1;
                productQuantity.textContent = 'Quantity: ' + product.quantity;
                productCalorie.textContent = 'Calorie: ' + product.calorie * product.quantity;
                updateLocalStorage(products);
                totalCalories -= +product.calorie;
                localStorage.setItem('totalCalories', totalCalories);
                document.getElementById('total-count').textContent = totalCalories;
            }
        });

        deleteButton.addEventListener('click', () => {
            const index = productBlock.getAttribute('data-index');
            products.splice(index, 1);
            updateLocalStorage(products);
            totalCalories -= +product.calorie * +product.quantity;
            localStorage.setItem('totalCalories', totalCalories);
            document.getElementById('total-count').textContent = totalCalories;
            productBlock.remove();
            if (products.length === 0) {
                document.getElementById('empty-products').style.display = 'block';
                document.querySelectorAll('.calories')[0].style.display = 'none';
                document.querySelectorAll('.calories')[1].style.display = 'none';
                totalCalories = 0;
                document.getElementById('calories-chart').style.display = 'none';
            }
        });
    
        return productBlock;
    };
    
    if (products === null || products.length === 0) {
        document.getElementById('empty-products').style.display = 'block';
        document.getElementsByClassName('calories')[0].style.display = 'none';
        document.getElementsByClassName('calories')[1].style.display = 'none';
        products = [];
        localStorage.setItem('products', JSON.stringify(products));
        document.getElementById('calories-chart').style.display = 'none';
    } else {
        document.getElementById('empty-products').style.display = 'none';
        document.querySelectorAll('.calories')[0].style.display = 'block';
        document.querySelectorAll('.calories')[1].style.display = 'block';
        document.getElementById('calories-chart').style.display = 'block';
        products.forEach((product) => {
            const productBlock = createProductBlock(product);
            document.getElementById('products-container').appendChild(productBlock);
        });
    }

    document.getElementById('edit').addEventListener('click', editTarget);

    document.getElementById('delete-all').addEventListener('click', () => {
        products = [];
        document.getElementById('calories-chart').style.display = 'none';
        localStorage.setItem('products', JSON.stringify(products));
        const productsContainer = document.getElementById('products-container');
        while (productsContainer.firstChild) {
          productsContainer.firstChild.remove();
        }
        document.getElementById('empty-products').style.display = 'block';
        document.getElementsByClassName('calories')[0].style.display = 'none';
        document.getElementsByClassName('calories')[1].style.display = 'none';
        totalCalories = 0;
        localStorage.setItem('totalCalories', 0);
        document.getElementById('total-count').textContent = parseInt(localStorage.getItem('totalCalories'));
    });

    const filterProducts = () => {
        const filterValue = document.getElementById('filter-input').value.toLowerCase();
        const productBlocks = document.getElementsByClassName('product-block');
      
        for (let i = 0; i < productBlocks.length; i++) {
          const productName = productBlocks[i].querySelector('h3').textContent.toLowerCase();
          if (productName.indexOf(filterValue) > -1) {
            productBlocks[i].style.display = 'flex'; // Отображаем блок продукта, если название соответствует фильтру
          } else {
            productBlocks[i].style.display = 'none'; // Скрываем блок продукта, если название не соответствует фильтру
          }
        }
    };

    document.getElementById('filter-input').addEventListener('input', filterProducts);

    let timer = setInterval(() => {
        const canvas = document.getElementById('calories-chart');
        const ctx = canvas.getContext('2d');
        canvas.width = 400; // ширина графика
        canvas.height = 300; // высота графика
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) / 2;

        // Рисуем фоновой круг
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();

        // Рисуем круг потребленных калорий
        const consumedAngle = (totalCalories / targetCalories) * 2 * Math.PI;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, 0, consumedAngle);
        ctx.fillStyle = 'red';
        ctx.fill();
    }, 1000)

    const openApp = () => { // функция при запуске приложения
        document.getElementById('start-window').style.display = 'none';
        document.getElementById('main-window').style.display = 'flex';
        if (localStorage.getItem('products') == null) {
            document.getElementById('empty-products').style.display = 'block';
        }

        document.getElementById('add-product').addEventListener('click', () => {
            document.getElementById('add-product').style.display = 'none';
            document.getElementById('params').style.display = 'flex';
        });

        document.getElementById('create-product').addEventListener('click', async () => {
            if (document.getElementById('name').value === '' || document.getElementById('calorie').value === '') {
                alert('Please, write all info');
            } else {
                document.getElementById('empty-products').style.display = 'none';
                let itemName = document.getElementById('name').value;
                let calorieItem = document.getElementById('calorie').value;
                let apiUrl = "https://api.unsplash.com/search/photos?query=" + itemName + "&client_id=1XIfraabfg1kbD7Ddj3tMykxWKCpIJdPhmbo8FnN16A";

                try {
                    let response = await fetch(apiUrl); // получаю изображение продукта через апишку unsplash
                    let data = await response.json();
                    let imageUrl = data.results[0].urls.regular; // Получаем URL изображения

                    let item = {
                        name: itemName,
                        calorie: calorieItem,
                        url: imageUrl,
                        id: products.length,
                        quantity: 1
                    };

                    let productBlock = createProductBlock(item);

                    document.getElementById('products-container').appendChild(productBlock);

                    products.push(item);
                    localStorage.setItem('products', JSON.stringify(products));
                } catch (error) {
                    console.log("Error:", error);
                }

                document.getElementById('name').value = '';
                document.getElementById('calorie').value = '';
            }
        });
    };

    document.getElementById('start').addEventListener('click', openApp);
};