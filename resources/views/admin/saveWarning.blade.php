<!-- Modal -->
<div class="modal fade" id="saveModal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Warning</h4>
            </div>
            <div class="modal-body">
                <h1>Warning! Your changes haven't been saved!</h1>
                <p>Leaving this page will remove all unsaved changes</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Go Back</button>
                <button type="button" class="btn btn-danger" v-on:click="handleSaveModal('proceed')">Proceed</button>
            </div>
        </div>
    </div>
</div>