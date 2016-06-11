<pages inline-template>
    <div class="panel panel-default">
        <div class="panel-heading">
            Pages
        </div>

        <div class="panel-body">
            <div v-for="page in pages">
                @{{ page.name }}
            </div>
        </div>
    </div>
</pages>