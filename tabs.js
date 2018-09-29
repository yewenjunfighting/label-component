Vue.component('tabs', {
    template: `
        <div class="tabs">
            <div class="tabs-bar">
                <div :class="tabCls(item)"
                     v-for="(item, index) in paneList"
                     @click="handleChange(index)"   
                >
                 {{item.label}}
                </div>
            </div>
            <div class="tabs-content">
                <slot></slot>
            </div>
        </div> 
    `,
    props: {
        value: {
           type:  [String, Number]
        }
    },
    methods: {
        getPanes: function (){
            return this.$children.filter(function(item){
                //$options返回的是
                //console.log(item.name);
                return item.$options.name === 'pane';
            });
        },
        updateNav: function(){
            this.paneList = [];
            let _this = this;
            this.getPanes().forEach(function(pane, index){
                _this.paneList.push({
                    label: pane.label,
                    name: pane.name || index
                });
                if(index === 0){
                    if(!_this.currentValue){
                        this.currentValue = pane.name || index;
                    }
                }
            });
            this.updateStatus();
        },
        updateStatus: function(){
            let panes = this.getPanes();
            let _this = this;
            panes.forEach(function(pane){
                return pane.show = pane.name === _this.currentValue;
            });
        },
        tabCls: function(item){
            return ['tabs-tab', {
                'tabs-tab-active': item.name === this.currentValue
            }]
        },
         handleChange: function(index){
            let nav = this.paneList[index];
            let name = nav.name;
            this.currentValue = name;
            this.$emit('input', name);
            this.$emit('on-click', name);
         }
    },
    data: function(){
        return {
            paneList: [],
            currentValue: this.value
        }
    },
    watch: {
        value: function(val){
            this.currentValue = val;
        },
        currentValue: function(){
            this.updateStatus();
        }
    }
})