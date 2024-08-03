function getActiveNodes(customSyntaxAST, nodeStatus) {
  let activeStack = [];
 
  const walk = new Walker();
  let nodeType = 'MustacheIdentifier';
  let returnType = { path: 'expression.name.name' };
  let matchLogic = walk.createMatchLogic(nodeType);
  let identifiers = walk.deepWalker(customSyntaxAST, nodeType, matchLogic, returnType);


  for (let i = 0; i < identifiers.length; ++i) {
    const targetNode = identifiers[i].node;
    const getNodeLocations = new GetNodePositions(customSyntaxAST, targetNode);
    const nodeLocations = getNodeLocations.init();

    const parentNode = nodeLocations[0].parentNode;
    const parentNodeIndex = nodeLocations[0].nodeIndex;

    const getParentLocation = new GetNodePositions(customSyntaxAST, parentNode);
    const grandParentLocation = getParentLocation.init();
    const grandParentNode = grandParentLocation[0].parentNode;
    const targetNodeIndex = grandParentLocation[0].nodeIndex;

    activeStack.push({
      identifier: identifiers[i].value,
      activeNode: targetNode,
      parentNode: parentNode,
      parentNodeIndex: parentNodeIndex,
    });
    
  }

  let attributeIdentifiers = [];
  const anodeType = 'Element';
  const areturnType = { path: 'value[0].name.name' };
  const amatchLogic = walk.createMatchLogic(anodeType);
  const elements = walk.deepWalker(customSyntaxAST, anodeType, amatchLogic, areturnType);

  elements.forEach(element => {
    if (element.node.attributes?.length > 0) {
      for (let i = 0; i < element.node.attributes.length; i += 1) {
        const attribute = element.node.attributes[i];
        if (attribute.value?.length > 0 && attribute.value[0].type === 'MustacheAttribute' && attribute.name.type !== 'EventHandler') {
          const matchedIdentifier = attribute.value[0].name.name;
          attributeIdentifiers.push({ value: matchedIdentifier, node: element.node });
        }
      }
    }
  });

  for (let i = 0; i < attributeIdentifiers.length; ++i) {
    const targetNode = attributeIdentifiers[i].node;
    const getNodeLocations = new GetNodePositions(customSyntaxAST, targetNode);
    const nodeLocations = getNodeLocations.init();

    const parentNode = nodeLocations[0].parentNode;
    const parentNodeIndex = nodeLocations[0].nodeIndex;

    const getParentLocation = new GetNodePositions(customSyntaxAST, parentNode);
    const grandParentLocation = getParentLocation.init();
    const grandParentNode = grandParentLocation[0].parentNode;
    const targetNodeIndex = grandParentLocation[0].nodeIndex;

    activeStack.push({
      identifier: attributeIdentifiers[i].value,
      activeNode: targetNode,
      parentNode: parentNode,
      parentNodeIndex: parentNodeIndex,
    });
  }

  const identifiersOnly = identifiers.map(item => item.value);
  const attrIdentifiersOnly = attributeIdentifiers.map(item => item.value);

  attrIdentifiersOnly.forEach(identifier => {
    identifiersOnly.push(identifier);
  });

  const visitor = new AnyVisitor();
  const handlers = visitor.htmlFunctionCallEventHandlers(customSyntaxObject);

  let identifiersInFunctions = "";
  if (identifiers && handlers) {
    identifiersInFunctions = visitor.getIdentifiersInFunctions(identifiersOnly, handlers, customSyntaxAST[0], jsAST);
  }

  let reactiveIdentifiersOnly = [];

  for (const item of identifiersInFunctions) {
    const keys = Object.keys(item);
    reactiveIdentifiersOnly.push(keys[0]);
  }

  const reactiveStack = [];
  let transpiledObjects;

  if (reactiveIdentifiersOnly.length > 0) {
    for (let n = 0; n < reactiveIdentifiersOnly.length; ++n) {
      activeStack.forEach(block => {
        if (block.identifier === reactiveIdentifiersOnly[n]) {
          reactiveStack.push(block);
        }
      });
    }
  }

  if (nodeStatus === 1 && activeStack.length > 0) {
    return activeStack[0];
  }

  const staticStack = activeStack.filter(activeItem => {
    return !reactiveStack.some(reactiveItem => walk.deepEqual(activeItem, reactiveItem));
  });

  if (nodeStatus === 0 && staticStack.length > 0) {
    return staticStack[0];
  }


}
