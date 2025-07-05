import React from 'react'

function useChatScroll(dep){
  const ref = React.useRef();
  React.useEffect(() => {
    if (ref.current) {
    //   ref.current.scrollTop = ref.current.scrollHeight;
    ref.current.scrollTo({
      top: ref.current.scrollHeight,
      behavior: "smooth",
    });
    }
  }, [dep]);
  return ref;
}

export default useChatScroll;