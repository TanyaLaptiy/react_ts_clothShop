import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem } from '../../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom'; // Navigate нужен для перехода на другую страницу
import { RootState } from '../../redux/store';

function formatCompoundText(string: string) {
  let formatedString = string;
  const tokens = ['Калорийность', 'Белки', 'Жиры', 'Углеводы', 'Состав', 'Срок годности'];
  tokens.forEach((token) => {
    formatedString = formatedString.replace(token, `\n${token}`);
  });
  return formatedString;
}

type PieBlockProps = {
  id: number;
  firstImage: string;
  secondImage?: string;
  title: string;
  secondTitle: string;
  description: string;
  size: string[];
  price: number;
};

export const PieBlock: React.FC<PieBlockProps> = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allowedSizes = ['XS', 'M', 'L'];
  const [activeSize, setActiveSize] = React.useState(props.size[0]);
  const currentItem = useSelector((state: RootState) =>
    state.cart.items.find((item) => item.id === props.id),
  );
  const addedCount = currentItem && currentItem.count;

  const onClickAdd = () => {
    dispatch(addItem(props));
  };
  const onSelectSize = (size: string) => {
    setActiveSize(size);
  };

  return (
    <div className="item-block">
      <div className="animate">
        <img
          className={props.secondImage ? 'item-block__image first' : 'item-block__image'}
          src={props.secondImage}
          alt="item"
        />
        <img
          className={props.secondImage ? 'item-block__image second' : 'item-block__image'}
          src={props.firstImage}
          alt="item"
        />
      </div>

      <h4
        onClick={() => {
          navigate(`/cloth/${props.id}`);
        }}
        className="item-block__title">
        {props.title}
      </h4>
      <em className="item-block__second-title">{props.secondTitle}</em>
      <div className="item-block__selector">
        <p>{props.description}</p>
        <ul>
          {allowedSizes.map((size, index) =>
            props.size.includes(size) ? (
              <li
                key={size}
                onClick={() => {
                  onSelectSize(size);
                }}
                className={activeSize === size ? 'active' : ''}>
                {size}
              </li>
            ) : (
              <li key={size} className="disabled">
                {size}
              </li>
            ),
          )}
        </ul>
      </div>
      <div className="item-block__bottom">
        <div className="item-block__price">{props.price} ₽</div>
        <button onClick={onClickAdd} className="button button--outline button--add">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10.8 4.8H7.2V1.2C7.2 0.5373 6.6627 0 6 0C5.3373 0 4.8 0.5373 4.8 1.2V4.8H1.2C0.5373 4.8 0 5.3373 0 6C0 6.6627 0.5373 7.2 1.2 7.2H4.8V10.8C4.8 11.4627 5.3373 12 6 12C6.6627 12 7.2 11.4627 7.2 10.8V7.2H10.8C11.4627 7.2 12 6.6627 12 6C12 5.3373 11.4627 4.8 10.8 4.8Z"
              fill="white"
            />
          </svg>
          <span>Добавить</span>
          {currentItem && <i>{addedCount}</i>}
        </button>
      </div>
    </div>
  );
};
