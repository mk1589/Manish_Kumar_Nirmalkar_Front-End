## Deployed Link : https://manishnirmalkar-steeley-front-assignm.netlify.app/
# 1) Explain what the simple List component does.
`WrappedSingleListItem`, another memoized functional component, is used by the `WrappedListComponent` to produce a list of elements.

The `WrappedListComponent` accepts an array of objects called `items` as props, where each object in the array needs have a parameter named "text" of type string. Using the `map` function, the component iterates through the `items` array and renders a `SingleListItem` component for each object. The `SingleListItem` component receives props such as onClickHandler, text, index, and isSelected from the `WrappedListComponent`.

The `index` parameter is a mechanism to identify between various list items that is exclusive to each `SingleListItem` component. The`selectedIndex` value initially indicates null, which means that no list item has been selected. The`selectedIndex` value is modified to reflect the index value of the clicked item, allowing the code to determine which item was selected when the user clicks on a certain list item.

The `isSelected` prop is utilized to indicate which list item has been selected, and it is distinguished by changing the background color of the selected item to green. Conversely, if `isSelected` is false, the background color of the item will be red. At first, all list items have a red background.

To minimize unnecessary re-rendering, the `WrappedSingleListItem` component is memoized and will only re-render if there is a change in the `isSelected` prop's value. This guarantees that the component will not re-render needlessly, even if the user double-clicks on a list item.

# 2) What problems / warnings are there with code?
Ans: The code has several issues and warnings that need to be addressed to ensure the proper rendering of the component.

#### 1. The `onClickHandler` property in the `WrappedSingleListItem` component is being invoked incorrectly. It should be passed as a callback function that will be triggered when the corresponding list item is clicked.

#### Given:

```js
const WrappedSingleListItem = ({
  index,
  isSelected,
  onClickHandler,
  text,
}) => {
  return (
    <li
      style={{ backgroundColor: isSelected ? 'green' : 'red'}}
      onClick={onClickHandler(index)}>
      {text}
    </li>
  );
};
```

#### Modified:
```js
const WrappedSingleListItem = ({
  index,
  isSelected,
  onClickHandler,
  text,
}) => {
  return (
    <li
      style={{ backgroundColor: isSelected ? 'green' : 'red'}}
      onClick={() => onClickHandler(index)}> 
      {text}
    </li>
  );
};
```

#### 2.Uncaught TypeError: `setSelectedIndex` is not a function.This error occurs because the useState hook in the `WrappedListComponent` component is initializing the `selectedIndex` state incorrectly. The initial value of `null` should appear first in the returned array, not the setter function.

#### Given:
```js
const [setSelectedIndex, selectedIndex] = useState();
```

#### Modified:
```js
const [selectedIndex, setSelectedIndex] = useState();
```

#### 3. To prevent all the content in the list from changing color when a list item is clicked, we can modify the `isSelected` property as follows: `isSelected = (selectedIndex === index)`. This will ensure that only the clicked option changes color based on its index in the list. and in the `map` function, the unique key value is not being defined as a prop for each child value. This can cause issues with rendering and updating the component correctly.

#### Given:
```js
return (
    <ul style={{ textAlign: 'left' }}>
      {items.map((item, index) => (
        <SingleListItem
          onClickHandler={() => handleClick(index)}
          text={item.text}
          index={index}
          isSelected={selectedIndex}
        />
      ))} </ul>
  )};
  ```
  
  #### Modified:
  ```js
   return (
    <ul style={{ textAlign: 'left' }}>
      {items.map((item, index) => (
        <SingleListItem
          onClickHandler={() => handleClick(index)}
          text={item.text}
          index={index}
          isSelected={selectedIndex === index}
          key = {index}
         
        />
      ))}
    </ul>
  )
};
```

#### 4. Uncaught TypeError: `PropTypes.shapeOf` is not a function. This error is due to an incorrect propTypes declaration for the `items` prop in the `WrappedListComponent` component.

Instead of `PropTypes.shapeOf`, the correct syntax is `PropTypes.shape`. 

#### Given:
```js
WrappedListComponent.propTypes = {
  items: PropTypes.array(PropTypes.shapeOf({ 
    text: PropTypes.string.isRequired,
  })),
 };
 ```
 
 #### Modified:
 ```js
 WrappedListComponent.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
  })),
 };
 ```
 
 # 3) Please fix, optimize, and/or modify the component as much as you think is necessary.
 Ans: The Working Modified Code:
 ```js
import './App.css';
import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';

// Single List Item
const WrappedSingleListItem = ({
  index,
  isSelected,
  onClickHandler,
  text,
}) => {
  return (
    <li
      style={{ backgroundColor: isSelected ? 'green' : 'red'}}
      onClick={() => onClickHandler(index)} 
    >
      {text}
    </li>
  );
};

WrappedSingleListItem.propTypes = {
  index: PropTypes.number,
  isSelected: PropTypes.bool,
  onClickHandler: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

const SingleListItem = memo(WrappedSingleListItem);

// List Component
const WrappedListComponent = ({
  items,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(); 



  useEffect(() => {
    setSelectedIndex(null);
  }, [items]);

  const handleClick = index => {
    setSelectedIndex(index);
  };

  return (
    <ul style={{ textAlign: 'left' }}>
      {items.map((item, index) => (
        <SingleListItem
          onClickHandler={() => handleClick(index)}
          text={item.text}
          index={index}
          isSelected={selectedIndex === index}
          key = {index}
         
        />
      ))}
    </ul>
  )
};

WrappedListComponent.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
  })),
};

WrappedListComponent.defaultProps = {
  items: null,
};

const List = memo(WrappedListComponent);

export default List;
```
