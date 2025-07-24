<div>
  <span>{user.firstName} {user.lastName}</span>
  <img src={user.avatarUrl} />
</div>


<p>{Math.round(percentage * 100)}% completed</p>


// ON EACH BLOCK

@if((a > b) && (c !== d))
  Complex condition content
@endif


@if((count * 2) > threshold)
  Double count exceeds threshold
@endif

@if((user.score > 100) && (user.status === 'active'))
  Premium active user content
@endif


@if(permissions & (READ | WRITE))
  <!-- Content when either read or write permission exists -->
@endif

@if((flags << 2) > MAX_VALUE)
  <!-- Content after bit shifting -->
@endif

@if(~visibility & HIDDEN)
  <!-- Content when NOT hidden -->
@endif



@if((user.roles & ADMIN) && !isSuspended)
  <!-- Admin-specific content -->
@endif

@if(config.flags & (FEATURE_A | FEATURE_B))
  <!-- Feature-flagged content -->
@endif






