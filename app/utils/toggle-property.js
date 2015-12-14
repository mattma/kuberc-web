export default function togglePropUtils(property, context) {
  context.get(property) ?
    context.set(property, false) :
    context.set(property, true);
};
