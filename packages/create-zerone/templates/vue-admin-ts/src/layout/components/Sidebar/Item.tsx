import { defineComponent } from 'vue';
import ElSvgItem from './ElSvgItem.vue';

export default defineComponent({
    props: {
        icon: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: '',
        },
        elSvgIcon: {
            type: String,
            default: '',
        },
    },
    setup(props) {
        return () => (
            <>
                {(() => {
                    if (props.elSvgIcon) {
                        return <ElSvgItem elSvgName={props.elSvgIcon} />;
                    } else if (props.icon) {
                        return <svg-icon icon-class={props.icon} />;
                    }
                })()}
                {props.title && <span>{props.title}</span>}
            </>
        );
    },
});

/* <style scoped>
.sub-el-icon {
    color: currentColor;
    width: 1em;
    height: 1em;
}
</style> */
