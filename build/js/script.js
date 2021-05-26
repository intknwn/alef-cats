'use strict';

(function () {
  const NAV_TOGGLE_BTN_CLASS = '.header__nav-toggle';
  const NAV_TOGGLE_BTN_TOGGLED_CLASS = 'header__nav-toggle--toggled';
  const NAV_CLASS = '.header__nav';
  const NAV_TOGGLED_CLASS = 'nav--toggled';
  const PRICE_SORT_BTN_CLASS = '.filters__button--price';
  const AGE_SORT_BTN_CLASS = '.filters__button--age';
  const RESULTS_ITEM_CLASS = '.results__list-item';
  const SORT_BTN_ASC_CLASS = 'filters__button--asc';
  const FAV_BTN_CLASS = '.card__fav-button';
  const ADDED_TO_FAV_BTN_CLASS = 'card__fav-button--active';
  const SUBSCRIBE_FORM_CLASS = '.subscribe__form';

  const TOAST_BG_COLOR = "#6ebbd3";

  function getData(parent, dataElement, attr) {
    return parent.querySelector(dataElement).getAttribute(attr);
  }

  function createSortCb(sortFn, elementClass, attr) {
    return function (item1, item2) {
      const price1 = getData(item1, elementClass, attr);
      const price2 = getData(item2, elementClass, attr);

      return sortFn(price1, price2);
    }
  }

  const SortFn = {
    ASC: function (a, b) {
      return a - b;
    },
    DESC: function (a, b) {
      return b - a
    },
  };

  const Sort = {
    PRICE: {
      ELEMENT: '.card__price',
      ATTR: 'data-price',
      BTN: '.filters__button--price',
    },
    AGE: {
      ELEMENT: '.card__age',
      ATTR: 'data-age',
      BTN: '.filters__button--age',
    }
  };

  const navToggleBtn = document.querySelector(NAV_TOGGLE_BTN_CLASS);
  const nav = document.querySelector(NAV_CLASS);
  const priceSortBtn = document.querySelector(PRICE_SORT_BTN_CLASS);
  const ageSortBtn = document.querySelector(AGE_SORT_BTN_CLASS);

  function createSortHandler(sortData) {
    let isAscending = true;

    return function () {
      const orderFn = isAscending ? SortFn.ASC : SortFn.DESC;
      const sortBtn = document.querySelector(sortData.BTN);

      if (isAscending) {
        sortBtn.classList.add(SORT_BTN_ASC_CLASS);
      } else {
        sortBtn.classList.remove(SORT_BTN_ASC_CLASS);
      }

      isAscending = !isAscending;

      const sortCb = createSortCb(orderFn, sortData.ELEMENT, sortData.ATTR);

      const items = document.querySelectorAll(RESULTS_ITEM_CLASS);
      const sortedItems = Array.prototype.slice.call(items).sort(sortCb);

      sortedItems.forEach(function (item, index) {
        item.style.order = index;
      });
    }
  }

  navToggleBtn.addEventListener('click', function (e) {
    e.preventDefault();

    if (nav.classList.contains(NAV_TOGGLED_CLASS)) {
      nav.classList.remove(NAV_TOGGLED_CLASS);
      navToggleBtn.classList.remove(NAV_TOGGLE_BTN_TOGGLED_CLASS);
      document.body.style.position = '';
      return;
    }

    nav.classList.add(NAV_TOGGLED_CLASS);
    navToggleBtn.classList.add(NAV_TOGGLE_BTN_TOGGLED_CLASS);
    document.body.style.position = 'fixed';
  });

  priceSortBtn.addEventListener('click', createSortHandler(Sort.PRICE))
  ageSortBtn.addEventListener('click', createSortHandler(Sort.AGE));

  const rootElement = document.documentElement;
  const scrollToTopBtn = document.querySelector('.results__scroll-top-button');

  function handleScroll() {
    if (rootElement.scrollTop > 0) {
      scrollToTopBtn.style.display = 'block';
    } else {
      scrollToTopBtn.style.display = 'none';
    }
  }

  function scrollToTop() {
    rootElement.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  document.addEventListener("scroll", handleScroll);
  scrollToTopBtn.addEventListener("click", scrollToTop);

  const form = document.querySelector(SUBSCRIBE_FORM_CLASS);
  const emailInput = document.querySelector('#email');

  form.noValidate = true;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    function validateEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

    if (validateEmail(emailInput.value)) {
      emailInput.setCustomValidity('');
    } else {
      emailInput.setCustomValidity('Пожалуйста, укажите валидный адрес электронной почты');
    }

    if (form.checkValidity()) {
      form.submit();
    } else {
      reportValidity(form);
    }
  });

  const addToFavavoriteBtns = document.querySelectorAll(FAV_BTN_CLASS);
  Array.prototype.slice.call(addToFavavoriteBtns).forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();

      const isActive = btn.classList.contains(ADDED_TO_FAV_BTN_CLASS);
      const msg = isActive ? 'Удалено из избранного 💔' : 'Добавлено в избранное ❤️';

      if (isActive) {
        btn.classList.remove(ADDED_TO_FAV_BTN_CLASS);
      } else {
        btn.classList.add(ADDED_TO_FAV_BTN_CLASS);
      }

      Toastify({
        text: msg,
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "right",
        backgroundColor: TOAST_BG_COLOR,
        onClick: function () { }
      }).showToast();

    });
  });
})();