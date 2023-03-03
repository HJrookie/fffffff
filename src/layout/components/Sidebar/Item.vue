<script>
export default {
  name: "MenuItem",
  functional: true,
  props: {
    icon: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  render(h, context) {
    const { icon, title } = context.props;
    const vnodes = [];

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon} />);
    }

    if (title) {
      if (title.length > 6) {
        vnodes.push(
          <el-tooltip class="item" effect="dark" content={title} placement="right">
            <span>{title} </span>
          </el-tooltip>
        );
        // <span slot="title">11</span>
      } else {
        vnodes.push(<span slot="title">{title}</span>);
      }
    }
    return vnodes;
  },
};
</script>
