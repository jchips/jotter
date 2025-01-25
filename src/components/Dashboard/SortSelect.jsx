'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createListCollection } from '@chakra-ui/react';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui/select';
import { setNotes, setFolders, setConfigs } from '@/reducers';
import { getLocalConfigs, setLocalConfigs } from '@/util/configUtil';
import sortMethods from '@/hooks/sortMethods';
import sortBy from '@/util/sortBy';
import api from '@/util/api';

const SortSelect = ({ notes, folders }) => {
  const configs = useSelector((state) => state.configs.value);
  const localConfigs = getLocalConfigs();
  const [sort, setSort] = useState(configs?.sort || localConfigs?.sort);
  const dispatch = useDispatch();
  const sortMethod = sortMethods;

  // Sorts notes and folders
  const sortNotes = (notes) => dispatch(setNotes(notes));
  const sortFolders = (folders) => dispatch(setFolders(folders));

  /**
   * Updates the user's new sort option in the db, global state,
   * and local storage
   * @param {String} sortOption - The selected sort option
   */
  const setUConfigs = (sortOption) => {
    const updateSort = async (sortOption) => {
      let configObj = { sort: sortOption };
      try {
        let res = await api.updateConfigs(configObj);
        dispatch(setConfigs({ ...res.data, ...configObj }));
        setLocalConfigs({ ...res.data, ...configObj });
      } catch (err) {
        console.error(err);
      }
    };
    updateSort(sortOption);
  };

  // Fetch/store sort config from database
  useEffect(() => {
    const fetchConfigs = async () => {
      let uConfigs = await api.getConfigs();
      setSort(uConfigs.data?.sort);
      dispatch(setConfigs(uConfigs.data));
      setLocalConfigs(uConfigs.data);
    };
    fetchConfigs();
  }, [dispatch]);

  return (
    <SelectRoot
      className='sort'
      collection={sortValues}
      variant='outline'
      width='140px'
      placeholder='Sort'
      value={sort}
      onValueChange={(e) => {
        setSort(e.value);
        sortBy(
          e.value[0],
          sortMethod,
          notes,
          folders,
          sortNotes,
          sortFolders,
          setUConfigs
        );
        setUConfigs(e.value[0]);
      }}
    >
      {' '}
      <SelectTrigger>
        <SelectValueText placeholder='Sort' />
      </SelectTrigger>
      <SelectContent>
        {sortValues.items.map((sortBy) => (
          <SelectItem item={sortBy} key={sortBy.value}>
            {sortBy.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};

const sortValues = createListCollection({
  items: [
    { label: 'Last created', value: '1' },
    { label: 'First created', value: '2' },
    { label: 'Title - AZ', value: '3' },
    { label: 'Title - ZA', value: '4' },
    { label: 'Recently updated', value: '5' },
    { label: 'Oldest updated', value: '6' },
  ],
});

export default SortSelect;
