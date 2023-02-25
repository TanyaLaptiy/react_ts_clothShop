import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

import axios from 'axios';

type PropsType = {
  activeCategory: number;
  filter?: string;
  searchValue?: string;
  currentPage: number;
};

export type ItemType = {
  id: number;
  firstImage: string;
  secondImage?: string;
  title: string;
  secondTitle: string;
  description: string;
  size: string[];
  price: number;
};

export const fetchItems = createAsyncThunk<{ data: ItemType[]; pagesCount: number }, PropsType>(
  'cloth/fetchClothes',
  async (props) => {
    const res = await axios.get<ItemType[]>(
      `https://63f9a1b6473885d837d06834.mockapi.io/cloth?${props.filter}${
        props.activeCategory > 0 ? `&category=${props.activeCategory}` : ``
      }${props.searchValue ? `&search=${props.searchValue}` : ``}`,
    );

    const pagesCount = Math.ceil(res.data.length / 11);
    const { data } = await axios.get<ItemType[]>(
      `https://63f9a1b6473885d837d06834.mockapi.io/cloth?${props.filter}${
        props.activeCategory > 0 ? `&category=${props.activeCategory}` : ``
      }${props.searchValue ? `&search=${props.searchValue}` : ``}&limit=11&page=${
        props.currentPage - 1 <= pagesCount ? props.currentPage : 1
      }`,
    );
    return { data, pagesCount };
  },
);

export const fetchItemById = createAsyncThunk('cloth/fetchCloth', async (id: number) => {
  const { data } = await axios.get<ItemType[]>(
    `https://63f9a1b6473885d837d06834.mockapi.io/cloth?id=${id}`,
  );
  return data as ItemType[];
});

enum status {
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
}

interface ClothSliceState {
  items: ItemType[];
  currentItem: ItemType;
  pagesCount: number;
  status: status;
}

const initialState: ClothSliceState = {
  items: [],
  currentItem: {} as ItemType,
  pagesCount: 0,
  status: status.LOADING,
};

export const clothSlice = createSlice({
  name: 'cloth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchItems.pending, (state, action) => {
      state.items = [];
      state.pagesCount = 0;
      state.status = status.LOADING;
    });
    builder.addCase(fetchItems.fulfilled, (state, action) => {
      state.items = action.payload.data;
      state.pagesCount = action.payload.pagesCount;
      state.status = status.LOADED;
    });
    builder.addCase(fetchItems.rejected, (state, action) => {
      state.items = [];
      state.pagesCount = 0;
      state.status = status.ERROR;
    });
    builder.addCase(fetchItemById.pending, (state, action) => {
      state.currentItem = {} as ItemType;
      state.status = status.LOADING;
    });
    builder.addCase(fetchItemById.fulfilled, (state, action) => {
      state.currentItem = action.payload[0];
      state.status = status.LOADED;
    });
    builder.addCase(fetchItemById.rejected, (state, action) => {
      state.currentItem = {} as ItemType;
      state.status = status.ERROR;
    });
  },
});

export const selectPie = (state: RootState) => state.pie;
export default clothSlice.reducer;
