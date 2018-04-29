// import React from 'react';
// import Checkbox from 'material-ui/Checkbox';
// import ActionFavorite from 'material-ui/svg-icons/action/favorite';
// import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
// import Visibility from 'material-ui/svg-icons/action/visibility';
// import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';

// const styles = {
//   block: {
//     maxWidth: 250,
//   },
//   checkbox: {
//     marginBottom: 16,
//   },
// };

// class LikeBtn extends React.Component {
//   state = {
//     checked: false,
//   };

//   updateCheck() {
//     this.setState((oldState) => {
//       return {
//         checked: !oldState.checked,
//       };
//     });
//   };

//   onCheck(event, isInputChecked) {
//     if (isInputChecked) {
//       console.log('liked');
//       // API.addLike({
//       //   id: id
//       // })
//       // .then(res => console.log(res))
//       // .catch(err => console.log(err));
//     } else {
//       console.log("unliked");
//     }
//   };

//   render() {
//     return (
//       <div style={styles.block}>
//         <Checkbox
//           onCheck={this.onCheck}
//           checkedIcon={<ActionFavorite />}
//           uncheckedIcon={<ActionFavoriteBorder />}
//           style={styles.checkbox}
//         />
//       </div>
//     );
//   }
// }

// export default LikeBtn;