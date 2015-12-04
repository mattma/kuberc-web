import AuthenticatedRoute from 'dashboard/mixins/routes/authenticated';
import styleBody from 'dashboard/mixins/style-body';

export default AuthenticatedRoute.extend(styleBody, {
  classNames: ['page', 'dashboard']
});
