import React, { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import './index.scss';

function generateUuid(len?: number, radix?: number) {
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	var uuid = [],
		i;
	radix = radix || chars.length;

	if (len) {
		// Compact form
		for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
	} else {
		// rfc4122, version 4 form
		var r;

		// rfc4122 requires these characters
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';

		// Fill in random data.  At i==19 set the high bits of clock sequence as
		// per rfc4122, sec. 4.1.5
		for (i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | Math.random() * 16;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
	}

	return uuid.join('');
}

export default ({
  children
}) => {
  const [editable, setEditable] = useState(true);
  const edittingIdRef = useRef<string>(null);
  const [value, setValue] = useState<any[]>([{
    id: generateUuid(),
    type: 'title', 
    content: `Capítulo I: Que trata de la condición y ejercicio del famoso hidalgo D. Quijote de la Mancha`
  }, {
    id: generateUuid(),
    type: 'text',
    content: `En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor. Una olla de algo más vaca que carnero, salpicón las más noches, duelos y quebrantos los sábados, lentejas los viernes, algún palomino de añadidura los domingos, consumían las tres partes de su hacienda. El resto della concluían sayo de velarte, calzas de velludo para las fiestas con sus pantuflos de lo mismo, los días de entre semana se honraba con su vellori de lo más fino. Tenía en su casa una ama que pasaba de los cuarenta, y una sobrina que no llegaba a los veinte, y un mozo de campo y plaza, que así ensillaba el rocín como tomaba la podadera. Frisaba la edad de nuestro hidalgo con los cincuenta años, era de complexión recia, seco de carnes, enjuto de rostro; gran madrugador y amigo de la caza. Quieren decir que tenía el sobrenombre de Quijada o Quesada (que en esto hay alguna diferencia en los autores que deste caso escriben), aunque por conjeturas verosímiles se deja entender que se llama Quijana; pero esto importa poco a nuestro cuento; basta que en la narración dél no se salga un punto de la verdad`
  }]);

  // useLayoutEffect(() => {
  //   console.log(value)
  //   if (
  //     value && value.length && 
  //     value.some(item => item.type == 'text' && item.content == '#### ')
  //   ){
  //     const newValue = value.map(item => {
  //       if (item.type == 'text' && item.content == '#### '){
  //         item.type = 'title';
  //       };
  //       return item;
  //     });
  //     setValue(newValue);
  //   }
  // }, [value]);

  const getEdittingItem = useCallback(() => {
    console.log(value)
    console.log(edittingIdRef.current)
    if (value && value.length && edittingIdRef.current){
      return value.find(item => item.id == edittingIdRef.current);
    }
  }, [value, edittingIdRef]);

  const getNodeById = (id: string) => {
    console.log(id)
    return document.body.querySelector(`[data-id='${id}']`);
  };

  const getEdittingNode = useCallback(() => {
    console.log(edittingIdRef.current)
    if (edittingIdRef.current){
      return getNodeById(edittingIdRef.current);
    }
  }, [edittingIdRef]);

  const setEdittingItemContent = useCallback(() => {
    const edittingItem = getEdittingItem();
    const edittingNode = getEdittingNode();

    console.log(edittingItem)
    console.dir(edittingNode)
    if (edittingItem && edittingNode){
      let content = edittingNode.innerHTML;
      switch(edittingItem.type){
        case 'text':
        console.log(content)
        console.log(content == '#### ')
          if (content == '#### '){
            edittingItem.type = 'title';
          };

          edittingItem.content = content;
          break;
        default:
          edittingItem.content = content;
          break;
      };

      console.log(edittingItem)
      setValue([...value]);
    }
  }, [value]);

  const handleKeyUp = useCallback((event: React.KeyboardEvent) => {
    // 回车
    if (event.keyCode == 13){
      event.preventDefault();
      const edittingItem = getEdittingItem();
      const index = value.map(item => item.id).indexOf(edittingItem.id);

      setValue([
        ...value.slice(0, index + 1),
        {
          type: edittingItem.type,
          id: generateUuid(),
        },
        ...value.slice(index + 1, value.length),
      ]);
    } else {
      console.log(222)
      // setEdittingItemContent();
    };
  }, [value, edittingIdRef]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    // 回车
    if (event.keyCode == 13){
      event.preventDefault();
    }
  }, []);

  /**
   * 记录光标所在的条目 id
   * onMouseDown 事件 anchorNode 可能为 null
   * @param event 
   */
  const handleMouseUp = (event: React.MouseEvent) => {
    const selection = window.getSelection();
    // 选区所属的节点，如果是文本节点，向上选取普通节点
    // event.target 可能是容器节点，不是 p 等节点
    const { anchorNode, isCollapsed } = selection;
    // isCollapsed = true 为光标
    if (!isCollapsed) return;

    let node = anchorNode;
    while(node && node.nodeType != 1){
      console.dir(node)
      node = node.parentNode;
    };

    const id = node.getAttribute('data-id');
    console.log(id);
    edittingIdRef.current = id;
  }

  console.log(value);
  return (
    <div 
      className="react-editor-container" 
      contentEditable={editable}
      suppressContentEditableWarning
      // contenteditable 需要通过 onKeyUp、onKeyDown、onMouseDown 监听
      onKeyUp={handleKeyUp}
      onKeyDown={handleKeyDown}
      onMouseUp={handleMouseUp}
      // onSelect={e => console.log(e)}
    >
      {(value || []).map(item => {
        let elem = null;

        console.log(item.type)
        switch(item.type){
          case 'title':
            elem = (
              <h3 key={item.id} data-id={item.id}>
                {item.content}
              </h3>
            );
            break;
          case 'text':
            elem = (
              <p key={item.id} data-id={item.id}>
                {item.content}
              </p>
            );
            break;
        }

        return elem;
      })}
    </div>
  )
}