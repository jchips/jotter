'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createListCollection } from '@chakra-ui/react';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui/select';
import { setNotes } from '@/reducers/noteReducer';
import { setFolders } from '@/reducers/folderReducer';
import sortMethods from '@/hooks/sortMethods';
import sortBy from '@/util/sortBy';

const SortSelect = ({ notes, folders }) => {
  const [sort, setSort] = useState('1');
  const dispatch = useDispatch();
  const sortMethod = sortMethods;
  const sortNotes = (notes) => dispatch(setNotes(notes));
  const sortFolders = (folders) => dispatch(setFolders(folders));

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
        sortBy(e.value[0], sortMethod, notes, folders, sortNotes, sortFolders);
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
