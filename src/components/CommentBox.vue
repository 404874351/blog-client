<template>
  <div class="flex padding-lr ">
    <div style="height: 40px; width: 40px;">
      <el-image
        style="height: 40px; width: 40px; border-radius: 999px;"
        fit="cover" 
        :src="$store.state.userInfo && $store.state.userInfo.avatarUrl ? 
          $store.state.userInfo.avatarUrl : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'">
      </el-image>
    </div>
    <div class="margin-left" style="width: 100%;">
      <el-input 
        type="textarea"
        :rows="3"
        :placeholder="placeholder || '留下点什么吧...'"
        :value="value"
        @input="handleInput">
      </el-input>
      <div class="margin-top-sm flex justify-between align-center">
        <el-popover
          v-model="pickerVisible"
          trigger="manual"
          placement="right-start">
          <Picker 
            style="height: 200px;"
            :include="categoryList" 
            :showSearch="false" 
            :showPreview="false" 
            :showCategories="false" 
            @select="handleSelect" />
          <img slot="reference" @click="pickerVisible = !pickerVisible" class="emoji-icon" :src="require('@/assets/image/emoji.svg')"/>
        </el-popover>
        <div>
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import { Picker } from "emoji-mart-vue";
export default {
  name: "CommentBox",
  components: { 
    Picker
  },
  props: {
    value: String,
    placeholder: String,
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  data() {
    return {
      pickerVisible: false,
      content: '',
      categoryList: [
        'people', 
        // 'nature', 
        // 'foods', 
        // 'activity', 
        // 'places', 
        // 'objects', 
        // 'symbols', 
        // 'flags',
      ],
    }
  },
  created() {
    
  },
  mounted() {
  },
  methods: {
    handleInput(e) {
      this.content = e
      this.$emit('input', this.content)
    },

    handleSelect(e){
      this.content += e.native
      this.$emit('input', this.content)
    },

  },
}
</script>

<style scoped>
.emoji-mart {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  height: 420px;
  color: #ffffff !important;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  background: #fff;
}

.emoji-icon {
  height: 22px;
  width: 22px;
  cursor: pointer;
}
</style>